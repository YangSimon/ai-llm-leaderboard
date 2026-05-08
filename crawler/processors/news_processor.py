import re
from typing import List
from ..models import RawNews, ProcessedNews
from ..config import NEWS_RETENTION_DAYS, NEWS_MAX_COUNT
from ..utils.date_utils import parse_date, is_within_days, now_iso
from ..fetchers.news import NewsFetcher
from loguru import logger


# Category keyword mapping（中英文关键词）
CATEGORY_KEYWORDS = {
    '产品发布': ['release', 'launch', '发布', '推出', '上线', 'open', 'announce', '正式发布', '新模型', '旗舰'],
    '技术突破': ['breakthrough', 'research', 'paper', '突破', '研究', '论文', 'benchmark', 'sota', 'state-of-the-art', '新算法', 'architect'],
    '开源发布': ['open-source', 'open source', 'github', '开源', 'huggingface', '模型开源', '代码开源'],
    '行业动态': ['fund', 'invest', 'acquire', '融资', '收购', '合作', 'partnership', '估值', 'ipo', '独角兽'],
    '安全对齐': ['safety', 'alignment', 'security', '安全', '对齐', 'regulation', '监管', '伦理'],
}

def auto_categorize(title: str, summary: str, default: str = '行业动态') -> str:
    """Auto-categorize news based on keywords"""
    text = (title + ' ' + summary).lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in text:
                return category
    return default

# News image emoji by category
CATEGORY_EMOJI = {
    '产品发布': '🚀',
    '技术突破': '🔬',
    '开源发布': '📦',
    '行业动态': '📰',
    '安全对齐': '🛡️',
}


def process_news(raw_news: List[RawNews], existing_ids: set = None) -> List[ProcessedNews]:
    """Process raw news: deduplicate, categorize, prune"""
    if existing_ids is None:
        existing_ids = set()

    # Deduplicate by title
    seen_titles = set()
    unique = []
    for news in raw_news:
        title_key = news.title.strip().lower()[:80]
        if title_key in seen_titles:
            continue
        seen_titles.add(title_key)
        unique.append(news)

    # Process each item
    processed = []
    for news in unique:
        try:
            category = auto_categorize(news.title, news.summary)
            news_id = NewsFetcher.make_news_id(news.title)
            
            # Skip if already exists
            if news_id in existing_ids:
                continue

            # Parse date
            try:
                dt = parse_date(news.published)
                date_str = dt.strftime('%Y-%m-%d')
            except Exception:
                date_str = ''

            processed.append(ProcessedNews(
                id=news_id,
                title=news.title,
                summary=news.summary,
                content=news.summary,  # Use summary as content for RSS items
                source=news.source_name,
                date=date_str,
                category=category,
                image=CATEGORY_EMOJI.get(category, '📰'),
                url=news.link,
                author=news.author,
                lastUpdated=now_iso(),
            ))
        except Exception as e:
            logger.debug(f"Error processing news item: {e}")
            continue

    # Sort by date (newest first)
    processed.sort(key=lambda x: x.date, reverse=True)

    # Prune: keep only within retention period and max count
    filtered = []
    for news in processed:
        if news.date and is_within_days(news.date, NEWS_RETENTION_DAYS):
            filtered.append(news)
        elif not news.date:
            filtered.append(news)
        if len(filtered) >= NEWS_MAX_COUNT:
            break

    logger.info(f"News processing: {len(raw_news)} raw -> {len(unique)} unique -> {len(filtered)} final")
    return filtered
