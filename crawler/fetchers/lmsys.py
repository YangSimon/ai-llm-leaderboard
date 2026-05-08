from typing import List, Optional
from .base import BaseFetcher
from ..models import RawModel
from ..config import DATA_SOURCES
from loguru import logger


class LMSYSFetcher(BaseFetcher):
    """Fetch leaderboard data from LMSYS Chatbot Arena"""

    def __init__(self):
        super().__init__('LMSYS')
        self.url = DATA_SOURCES[0].url

    async def fetch(self) -> List[RawModel]:
        """Fetch models from LMSYS Arena API"""
        models = []
        data = await self.fetch_json(self.url)
        if not data:
            logger.warning("[LMSYS] No data returned")
            return models

        try:
            # The API returns a list of model entries
            entries = data if isinstance(data, list) else data.get('data', data.get('models', []))
            
            if isinstance(entries, dict):
                # Sometimes it's {category: [models]}
                for key, val in entries.items():
                    if isinstance(val, list):
                        entries.extend(val)
                    elif isinstance(val, dict):
                        entries = list(val.values())

            if not isinstance(entries, list):
                logger.error(f"[LMSYS] Unexpected data format: {type(entries)}")
                return models

            for entry in entries:
                if not isinstance(entry, dict):
                    continue
                try:
                    name = entry.get('model', entry.get('name', ''))
                    if not name:
                        continue
                    
                    elo = entry.get('elo', entry.get('rating', None))
                    if elo is not None:
                        try:
                            elo = float(elo)
                        except (ValueError, TypeError):
                            elo = None
                    
                    company = entry.get('organization', entry.get('org', entry.get('created_by', '')))
                    if isinstance(company, str):
                        company = company.split('/')[0].strip()
                    
                    vote_count = entry.get('num_votes', entry.get('votes', 0))

                    models.append(RawModel(
                        name=name,
                        company=company,
                        source='lmsys',
                        elo_score=elo,
                        vote_count=vote_count,
                    ))
                except Exception as e:
                    logger.debug(f"[LMSYS] Error parsing entry: {e}")
                    continue

            logger.info(f"[LMSYS] Fetched {len(models)} models")
        except Exception as e:
            logger.error(f"[LMSYS] Error parsing data: {e}")
        
        return models
