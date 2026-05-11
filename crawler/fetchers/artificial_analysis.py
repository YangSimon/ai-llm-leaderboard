import json
import re
from typing import List, Optional
from bs4 import BeautifulSoup, Tag
from .base import BaseFetcher
from ..models import RawModel
from ..config import DATA_SOURCES
from loguru import logger


class ArtificialAnalysisFetcher(BaseFetcher):
    """Fetch model data from Artificial Analysis website.

    Uses multiple extraction strategies in priority order:
    1. Next.js __NEXT_DATA__ JSON (most detailed, preferred)
    2. Inline JSON-LD / schema.org data
    3. Embedded <script> tags with model data arrays
    4. HTML <table> parsing with column header detection
    5. Div/card-based layout parsing (fallback)
    """

    def __init__(self):
        super().__init__('ArtificialAnalysis')
        self.url = DATA_SOURCES[2].url

    async def fetch(self) -> List[RawModel]:
        """Fetch models using all available extraction strategies."""
        html = await self.fetch_html(self.url)
        if not html:
            return []

        soup = BeautifulSoup(html, 'lxml')

        # Try strategies in priority order
        for strategy in [
            self._extract_next_data,
            self._extract_json_ld,
            self._extract_script_data,
            self._extract_table,
            self._extract_cards,
        ]:
            try:
                models = strategy(soup)
                if models:
                    logger.info(
                        f"[ArtificialAnalysis] {strategy.__name__}: "
                        f"extracted {len(models)} models"
                    )
                    return models
            except Exception as e:
                logger.debug(f"[ArtificialAnalysis] {strategy.__name__} failed: {e}")

        logger.warning("[ArtificialAnalysis] All strategies failed, returning empty")
        return []

    # ── Strategy 1: Next.js __NEXT_DATA__ ──────────────────────────────

    def _extract_next_data(self, soup: BeautifulSoup) -> List[RawModel]:
        """Extract model data from Next.js embedded JSON."""
        models = []
        for script in soup.find_all('script', id='__NEXT_DATA__'):
            text = script.string or ''
            if not text:
                continue
            try:
                data = json.loads(text)
                model_data = self._find_models_in_json(data)
                models.extend(model_data)
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                logger.debug(f"[ArtificialAnalysis] __NEXT_DATA__ parse error: {e}")
        return models

    def _find_models_in_json(self, data, depth: int = 0) -> List[RawModel]:
        """Recursively search JSON structure for model-like objects."""
        if depth > 10:
            return []

        results = []

        if isinstance(data, dict):
            # Check for direct model data
            for key in ['models', 'modelData', 'leaderboard', 'rankings', 'data']:
                if key in data:
                    val = data[key]
                    if isinstance(val, list):
                        for item in val:
                            if isinstance(item, dict) and self._looks_like_model(item):
                                results.append(self._parse_model_dict(item))

            # Recurse into nested structures
            props = data.get('props', {})
            if isinstance(props, dict):
                page_props = props.get('pageProps', {})
                if isinstance(page_props, dict):
                    for key in ['models', 'data', 'leaderboardData', 'rankings']:
                        if key in page_props:
                            val = page_props[key]
                            if isinstance(val, list):
                                for item in val:
                                    if isinstance(item, dict) and self._looks_like_model(item):
                                        results.append(self._parse_model_dict(item))

        elif isinstance(data, list):
            for item in data:
                if isinstance(item, (dict, list)):
                    results.extend(self._find_models_in_json(item, depth + 1))

        return results

    def _looks_like_model(self, obj: dict) -> bool:
        """Check if a dict looks like a model entry."""
        name_keys = {'displayName', 'name', 'model', 'modelName', 'id', 'title'}
        return bool(name_keys & set(obj.keys()))

    def _parse_model_dict(self, obj: dict) -> RawModel:
        """Parse a model-like dict into a RawModel."""
        name = (
            obj.get('displayName')
            or obj.get('name')
            or obj.get('model')
            or obj.get('modelName')
            or obj.get('id')
            or obj.get('title', '')
        )
        company = obj.get('provider') or obj.get('company') or obj.get('organization') or ''
        if not company and '/' in name:
            company = name.split('/')[0].strip()

        # Try multiple score locations
        scores = obj.get('scores') or obj.get('benchmarks') or obj.get('metrics') or {}

        overall = None
        reasoning = None
        coding = None
        math = None
        multimodal = None

        if isinstance(scores, dict):
            overall = self._safe_float(scores.get('overall') or scores.get('weighted') or scores.get('total'))
            reasoning = self._safe_float(scores.get('reasoning') or scores.get('reasoningScore'))
            coding = self._safe_float(scores.get('coding') or scores.get('codingScore') or scores.get('code'))
            math = self._safe_float(scores.get('math') or scores.get('mathScore'))
            multimodal = self._safe_float(scores.get('multimodal') or scores.get('vision') or scores.get('image'))

        ctx_len = obj.get('contextLength') or obj.get('context_length') or obj.get('contextWindow')

        return RawModel(
            name=name.strip(),
            company=company.strip() if isinstance(company, str) else '',
            source='artificial_analysis',
            overall_score=overall,
            reasoning=reasoning,
            coding=coding,
            math=math,
            multimodal=multimodal,
            context_length=ctx_len,
            extra={'aa_raw': obj},
        )

    # ── Strategy 2: JSON-LD / Schema.org ───────────────────────────────

    def _extract_json_ld(self, soup: BeautifulSoup) -> List[RawModel]:
        """Extract model data from JSON-LD / schema.org structured data."""
        models = []
        for script in soup.find_all('script', type='application/ld+json'):
            text = script.string or ''
            if not text:
                continue
            try:
                data = json.loads(text)
                if isinstance(data, dict):
                    items = data.get('@graph', [data])
                else:
                    items = data if isinstance(data, list) else [data]

                for item in items:
                    if isinstance(item, dict):
                        name = item.get('name', '')
                        if name and ('model' in name.lower() or 'ai' in name.lower() or item.get('@type') == 'SoftwareApplication'):
                            desc = item.get('description', '')
                            company = item.get('publisher', {}).get('name', '') if isinstance(item.get('publisher'), dict) else ''
                            models.append(RawModel(
                                name=name,
                                company=company,
                                source='artificial_analysis',
                                extra={'json_ld': item},
                            ))
            except (json.JSONDecodeError, KeyError):
                continue
        return models

    # ── Strategy 3: Other embedded <script> data ────────────────────────

    def _extract_script_data(self, soup: BeautifulSoup) -> List[RawModel]:
        """Extract model data from non-NextJS script tags containing JSON arrays."""
        models = []
        model_name_patterns = [
            r'gpt', r'claude', r'gemini', r'llama', r'mistral', r'deepseek',
            r'qwen', r'grok', r'phi', r'gemma', r'yi-', r'glm',
        ]

        for script in soup.find_all('script'):
            text = script.string or ''
            if not text or len(text) < 50:
                continue
            # Skip already processed
            if script.get('id') == '__NEXT_DATA__' or script.get('type') == 'application/ld+json':
                continue

            # Look for JSON-like content that might hold model data
            for match in re.finditer(r'(\[[\s\S]*?\])', text):
                try:
                    data = json.loads(match.group(1))
                    if not isinstance(data, list) or len(data) < 2:
                        continue
                    # Check if entries look like model data
                    sample = data[0]
                    if isinstance(sample, dict) and self._looks_like_model(sample):
                        for item in data:
                            if isinstance(item, dict):
                                models.append(self._parse_model_dict(item))
                        if models:
                            return models
                except json.JSONDecodeError:
                    continue

            # Try object assignments: window.__DATA__ = {...} or var models = [...]
            for match in re.finditer(r'(?:var|let|const|window\.)\s*\w+\s*=\s*(\[[\s\S]*?\]);', text):
                try:
                    data = json.loads(match.group(1))
                    if isinstance(data, list) and len(data) >= 1:
                        sample = data[0]
                        if isinstance(sample, dict) and self._looks_like_model(sample):
                            for item in data:
                                if isinstance(item, dict):
                                    models.append(self._parse_model_dict(item))
                            if models:
                                return models
                except json.JSONDecodeError:
                    continue

        return models

    # ── Strategy 4: HTML Table parsing ──────────────────────────────────

    def _extract_table(self, soup: BeautifulSoup) -> List[RawModel]:
        """Extract model data from HTML tables with column header detection."""
        models = []
        tables = soup.find_all('table')

        for table in tables:
            headers = []
            header_row = table.find('thead')
            if header_row:
                headers = [
                    th.get_text(strip=True).lower()
                    for th in header_row.find_all(['th', 'td'])
                ]
            else:
                # Try first row as header
                first_row = table.find('tr')
                if first_row:
                    headers = [
                        td.get_text(strip=True).lower()
                        for td in first_row.find_all(['th', 'td'])
                    ]

            if not headers:
                continue

            # Map column indices to fields
            col_map = self._map_columns(headers)
            if not col_map.get('name') and not col_map.get('model'):
                continue

            # Parse data rows
            tbody = table.find('tbody') or table
            rows = tbody.find_all('tr')
            start = 1 if headers and table.find('thead') else 1

            for row in rows[start:]:
                cells = row.find_all(['td', 'th'])
                if len(cells) < 2:
                    continue
                try:
                    model = self._parse_table_row(cells, col_map)
                    if model:
                        models.append(model)
                except Exception as e:
                    logger.debug(f"[ArtificialAnalysis] Table row parse error: {e}")

            if models:
                break  # Use the first table that yields models

        return models

    def _map_columns(self, headers: List[str]) -> dict:
        """Map table column headers to model fields."""
        col_map = {}
        name_keywords = {'model', 'name', 'model name', 'llm', 'ai model'}
        company_keywords = {'provider', 'company', 'organization', 'developer', 'creator'}
        score_keywords = {'score', 'quality', 'rating', 'overall', 'weighted', 'intelligence'}
        reasoning_keywords = {'reasoning', 'reason'}
        coding_keywords = {'coding', 'code', 'programming'}
        math_keywords = {'math', 'mathematics'}
        multimodal_keywords = {'multimodal', 'vision', 'image', 'visual'}
        ctx_keywords = {'context', 'context length', 'context window', 'tokens'}

        for i, h in enumerate(headers):
            h_clean = h.strip().lower()
            if any(kw in h_clean for kw in name_keywords) and 'name' not in col_map:
                col_map['name'] = i
            elif any(kw in h_clean for kw in company_keywords) and 'company' not in col_map:
                col_map['company'] = i
            elif any(kw in h_clean for kw in reasoning_keywords):
                col_map['reasoning'] = i
            elif any(kw in h_clean for kw in coding_keywords):
                col_map['coding'] = i
            elif any(kw in h_clean for kw in math_keywords):
                col_map['math'] = i
            elif any(kw in h_clean for kw in multimodal_keywords):
                col_map['multimodal'] = i
            elif any(kw in h_clean for kw in ctx_keywords):
                col_map['context_length'] = i
            elif any(kw in h_clean for kw in score_keywords) and 'overall' not in col_map:
                col_map['overall'] = i

        return col_map

    def _parse_table_row(self, cells: list, col_map: dict) -> Optional[RawModel]:
        """Parse a single table row into a RawModel."""
        name = self._cell_text(cells, col_map.get('name')) if 'name' in col_map else ''
        if not name:
            # Fallback: use first cell as name
            name = cells[0].get_text(strip=True)

        company = self._cell_text(cells, col_map.get('company')) if 'company' in col_map else ''

        overall = self._cell_float(cells, col_map.get('overall'))
        reasoning = self._cell_float(cells, col_map.get('reasoning'))
        coding = self._cell_float(cells, col_map.get('coding'))
        math = self._cell_float(cells, col_map.get('math'))
        multimodal = self._cell_float(cells, col_map.get('multimodal'))
        ctx_len = self._cell_int(cells, col_map.get('context_length'))

        return RawModel(
            name=name,
            company=company,
            source='artificial_analysis',
            overall_score=overall,
            reasoning=reasoning,
            coding=coding,
            math=math,
            multimodal=multimodal,
            context_length=ctx_len,
        )

    # ── Strategy 5: Card/div layout parsing ────────────────────────────

    def _extract_cards(self, soup: BeautifulSoup) -> List[RawModel]:
        """Extract model data from card-based layouts (last resort)."""
        models = []

        # Look for repeating card structures
        cards = (
            soup.find_all(class_=re.compile(r'model[-_]?card', re.I))
            or soup.find_all(class_=re.compile(r'row[-_]?item', re.I))
            or soup.find_all('div', class_=re.compile(r'(?:model|provider|llm)[-_]?(?:card|row|entry|item)', re.I))
        )

        if not cards:
            # Heuristic: find repeating div patterns
            parent = soup.find('main') or soup.find('body')
            if parent:
                direct_children = [c for c in parent.find_all('div', recursive=False) if isinstance(c, Tag)]
                if len(direct_children) >= 3:
                    cards = direct_children

        for card in cards:
            if not isinstance(card, Tag):
                continue

            # Extract name from heading or strong text
            name_el = (
                card.find(['h1', 'h2', 'h3', 'h4'])
                or card.find('strong')
                or card.find(class_=re.compile(r'(?:name|title|heading)', re.I))
            )
            if not name_el:
                continue

            name = name_el.get_text(strip=True)
            if not name or len(name) > 80:
                continue

            # Try to find a score
            score_el = card.find(class_=re.compile(r'(?:score|rating|number|value)', re.I))
            score = self._safe_float(score_el.get_text(strip=True)) if score_el else None

            # Try to find company
            company_el = card.find(class_=re.compile(r'(?:company|provider|org)', re.I))
            company = company_el.get_text(strip=True) if company_el else ''

            models.append(RawModel(
                name=name,
                company=company,
                source='artificial_analysis',
                overall_score=score,
            ))

        return models

    # ── Helpers ────────────────────────────────────────────────────────

    @staticmethod
    def _safe_float(val) -> Optional[float]:
        """Safely convert a value to float."""
        if val is None:
            return None
        try:
            f = float(val)
            return f if f > 0 else None
        except (ValueError, TypeError):
            # Try cleaning: remove %, extract number
            if isinstance(val, str):
                match = re.search(r'[\d.]+', val)
                if match:
                    try:
                        return float(match.group())
                    except ValueError:
                        pass
            return None

    @staticmethod
    def _safe_int(val) -> Optional[int]:
        """Safely convert a value to int."""
        if val is None:
            return None
        try:
            return int(val)
        except (ValueError, TypeError):
            if isinstance(val, str):
                val = val.replace(',', '').replace(' ', '')
                try:
                    return int(val)
                except ValueError:
                    pass
            return None

    @staticmethod
    def _cell_text(cells: list, idx: Optional[int]) -> str:
        """Get text from a cell by index."""
        if idx is None or idx >= len(cells):
            return ''
        return cells[idx].get_text(strip=True)

    @staticmethod
    def _cell_float(cells: list, idx: Optional[int]) -> Optional[float]:
        """Get float from a cell by index."""
        text = ArtificialAnalysisFetcher._cell_text(cells, idx)
        if not text:
            return None
        return ArtificialAnalysisFetcher._safe_float(text)

    @staticmethod
    def _cell_int(cells: list, idx: Optional[int]) -> Optional[int]:
        """Get int from a cell by index."""
        text = ArtificialAnalysisFetcher._cell_text(cells, idx)
        if not text:
            return None
        return ArtificialAnalysisFetcher._safe_int(text)
