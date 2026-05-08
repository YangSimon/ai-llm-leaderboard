import asyncio
from typing import Optional, Any
import httpx
from loguru import logger


class BaseFetcher:
    """Base class for all fetchers with retry logic"""

    def __init__(self, name: str):
        self.name = name
        self.client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={'User-Agent': 'AI-Leaderboard-Crawler/1.0'},
            follow_redirects=True,
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.aclose()

    async def fetch_json(self, url: str, max_retries: int = 3) -> Optional[Any]:
        """Fetch JSON from URL with retry"""
        for attempt in range(max_retries):
            try:
                logger.debug(f"[{self.name}] Fetching {url} (attempt {attempt + 1}/{max_retries})")
                resp = await self.client.get(url)
                resp.raise_for_status()
                data = resp.json()
                logger.info(f"[{self.name}] Successfully fetched {url}")
                return data
            except httpx.HTTPStatusError as e:
                logger.warning(f"[{self.name}] HTTP {e.response.status_code} for {url}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
            except httpx.TimeoutException:
                logger.warning(f"[{self.name}] Timeout for {url}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
            except Exception as e:
                logger.error(f"[{self.name}] Error fetching {url}: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
        logger.error(f"[{self.name}] Failed after {max_retries} retries: {url}")
        return None

    async def fetch_html(self, url: str, max_retries: int = 3) -> Optional[str]:
        """Fetch HTML from URL with retry"""
        for attempt in range(max_retries):
            try:
                logger.debug(f"[{self.name}] Fetching HTML {url} (attempt {attempt + 1}/{max_retries})")
                resp = await self.client.get(url)
                resp.raise_for_status()
                logger.info(f"[{self.name}] Successfully fetched HTML {url}")
                return resp.text
            except httpx.HTTPStatusError as e:
                logger.warning(f"[{self.name}] HTTP {e.response.status_code} for {url}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
            except httpx.TimeoutException:
                logger.warning(f"[{self.name}] Timeout for {url}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
            except Exception as e:
                logger.error(f"[{self.name}] Error fetching {url}: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
        logger.error(f"[{self.name}] Failed after {max_retries} retries: {url}")
        return None
