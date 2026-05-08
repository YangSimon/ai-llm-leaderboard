from typing import List
from bs4 import BeautifulSoup
from .base import BaseFetcher
from ..models import RawModel
from ..config import DATA_SOURCES
from loguru import logger


class ArtificialAnalysisFetcher(BaseFetcher):
    """Fetch model data from Artificial Analysis website"""

    def __init__(self):
        super().__init__('ArtificialAnalysis')
        self.url = DATA_SOURCES[2].url

    async def fetch(self) -> List[RawModel]:
        """Fetch models from Artificial Analysis by parsing HTML"""
        models = []
        html = await self.fetch_html(self.url)
        if not html:
            return models

        try:
            soup = BeautifulSoup(html, 'lxml')
            
            # Try to find model data in script tags (JSON embedded in page)
            scripts = soup.find_all('script')
            for script in scripts:
                text = script.string or ''
                if '__NEXT_DATA__' in text:
                    import json
                    try:
                        data = json.loads(text)
                        model_data = data.get('props', {}).get('pageProps', {}).get('models', [])
                        for m in model_data:
                            name = m.get('displayName', m.get('name', ''))
                            company = m.get('provider', m.get('company', ''))
                            if not name:
                                continue
                            
                            # Extract scores
                            scores = m.get('scores', m.get('benchmarks', {}))
                            if isinstance(scores, dict):
                                overall = scores.get('overall', scores.get('weighted', None))
                                reasoning = scores.get('reasoning', None)
                                coding = scores.get('coding', None)
                                math = scores.get('math', None)
                            else:
                                overall = None
                                reasoning = None
                                coding = None
                                math = None

                            models.append(RawModel(
                                name=name,
                                company=company,
                                source='artificial_analysis',
                                overall_score=overall,
                                reasoning=reasoning,
                                coding=coding,
                                math=math,
                            ))
                    except (json.JSONDecodeError, KeyError):
                        continue

            # Fallback: try table parsing
            if not models:
                tables = soup.find_all('table')
                for table in tables:
                    rows = table.find_all('tr')
                    for row in rows[1:]:  # Skip header
                        cells = row.find_all('td')
                        if len(cells) >= 2:
                            name = cells[0].get_text(strip=True)
                            models.append(RawModel(
                                name=name,
                                company='',
                                source='artificial_analysis',
                            ))

            logger.info(f"[ArtificialAnalysis] Fetched {len(models)} models")
        except Exception as e:
            logger.error(f"[ArtificialAnalysis] Error parsing HTML: {e}")

        return models
