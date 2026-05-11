import asyncio
import feedparser
import hashlib
import re
from typing import List
from .base import BaseFetcher
from ..models import RawNews
from ..config import NEWS_SOURCES
from ..utils.date_utils import parse_date
from loguru import logger


class NewsFetcher(BaseFetcher):
    """Fetch news from RSS feeds"""

    def __init__(self):
        super().__init__('NewsRSS')

    async def fetch_all(self) -> List[RawNews]:
        """Fetch news from all RSS sources in parallel"""
        tasks = [
            self._fetch_feed(source.name, source.url, source.category)
            for source in NEWS_SOURCES
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        all_news = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"[NewsRSS] Error fetching {NEWS_SOURCES[i].name}: {result}")
            else:
                all_news.extend(result)
        logger.info(f"[NewsRSS] Total fetched: {len(all_news)} news items")
        return all_news

    async def _fetch_feed(self, source_name: str, url: str, category: str) -> List[RawNews]:
        """Fetch and parse a single RSS feed"""
        items = []
        try:
            feed = await asyncio.to_thread(feedparser.parse, url)

            if feed.bozo and not feed.entries:
                logger.warning(f"[NewsRSS] Feed parse error for {source_name}: {feed.bozo_exception}")
                html = await self.fetch_html(url)
                if html:
                    feed = await asyncio.to_thread(feedparser.parse, html)

            for entry in feed.entries[:30]:
                title = entry.get('title', '').strip()
                if not title:
                    continue

                summary = entry.get('summary', entry.get('description', ''))
                summary = re.sub(r'<[^>]+>', '', summary).strip()

                link = entry.get('link', '')
                published = entry.get('published', entry.get('updated', ''))
                author = entry.get('author', entry.get('dc_creator', ''))

                items.append(RawNews(
                    title=title,
                    summary=summary[:300],
                    link=link,
                    published=published,
                    source_name=source_name,
                    author=author or source_name,
                ))

            logger.info(f"[NewsRSS] {source_name}: {len(items)} items")
        except Exception as e:
            logger.error(f"[NewsRSS] Error parsing {source_name}: {e}")

        return items

    @staticmethod
    def make_news_id(title: str) -> str:
        """Generate a unique ID for a news item"""
        return 'news-' + hashlib.sha256(title.encode()).hexdigest()[:12]
