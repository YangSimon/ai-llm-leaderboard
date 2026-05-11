from typing import List
from .base import BaseFetcher
from ..models import RawModel
from ..config import DATA_SOURCES
from loguru import logger


class OpenRouterFetcher(BaseFetcher):
    """Fetch model data from OpenRouter API"""

    def __init__(self):
        super().__init__('OpenRouter')
        self.url = next((s.url for s in DATA_SOURCES if s.name == 'OpenRouter'), DATA_SOURCES[1].url)

    async def fetch(self) -> List[RawModel]:
        """Fetch models from OpenRouter API"""
        models = []
        data = await self.fetch_json(self.url)
        if not data:
            return models

        try:
            entries = data if isinstance(data, list) else data.get('data', [])
            
            if not isinstance(entries, list):
                logger.error(f"[OpenRouter] Unexpected format: {type(entries)}")
                return models

            for entry in entries:
                if not isinstance(entry, dict):
                    continue
                try:
                    model_id = entry.get('id', '')
                    name = entry.get('name', model_id)
                    if not name:
                        continue

                    # Clean ID prefix (e.g., "openrouter/google/gemini-pro")
                    clean_id = model_id.split('/')[-1] if '/' in model_id else model_id

                    company = entry.get('created_by', '') or ''
                    if '/' in company:
                        company = company.split('/')[0]

                    ctx_len = entry.get('context_length', 0)

                    # OpenRouter pricing info
                    pricing = entry.get('pricing', {})
                    prompt_price = pricing.get('prompt', '0') if isinstance(pricing, dict) else '0'

                    models.append(RawModel(
                        name=name,
                        company=company,
                        source='openrouter',
                        context_length=ctx_len,
                        extra={'openrouter_id': model_id, 'clean_id': clean_id, 'pricing': prompt_price},
                    ))
                except Exception as e:
                    logger.debug(f"[OpenRouter] Error parsing entry: {e}")
                    continue

            logger.info(f"[OpenRouter] Fetched {len(models)} models")
        except Exception as e:
            logger.error(f"[OpenRouter] Error parsing data: {e}")

        return models
