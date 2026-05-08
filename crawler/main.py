#!/usr/bin/env python3
"""AI Leaderboard Crawler - Main entry point"""

import asyncio
import os
import sys
from pathlib import Path

# Add parent directory to path so we can import crawler modules
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from crawler.config import (
    OUTPUT_LEADERBOARD, OUTPUT_NEWS, OUTPUT_VERSION,
    NEWS_SOURCES,
)
from crawler.utils.logger import setup_logger
from crawler.utils.date_utils import now_iso

from crawler.fetchers.lmsys import LMSYSFetcher
from crawler.fetchers.openrouter import OpenRouterFetcher
from crawler.fetchers.artificial_analysis import ArtificialAnalysisFetcher
from crawler.fetchers.news import NewsFetcher

from crawler.processors.score_normalizer import normalize_all
from crawler.processors.deduplicator import deduplicate_models
from crawler.processors.news_processor import process_news
from crawler.processors.model_enricher import enrich_all, classify_models

from crawler.generators.js_generator import (
    generate_leaderboard_js,
    generate_news_js,
    generate_version_js,
)

from crawler.models import CrawlStats
from loguru import logger


async def fetch_all_leaderboard_data() -> list:
    """Fetch data from all leaderboard sources in parallel"""
    all_raw = []
    
    # LMSYS
    try:
        async with LMSYSFetcher() as f:
            lmsys_data = await f.fetch()
            all_raw.extend(lmsys_data)
    except Exception as e:
        logger.error(f"LMSYS fetch failed: {e}")
    
    # OpenRouter
    try:
        async with OpenRouterFetcher() as f:
            or_data = await f.fetch()
            all_raw.extend(or_data)
    except Exception as e:
        logger.error(f"OpenRouter fetch failed: {e}")
    
    # Artificial Analysis
    try:
        async with ArtificialAnalysisFetcher() as f:
            aa_data = await f.fetch()
            all_raw.extend(aa_data)
    except Exception as e:
        logger.error(f"ArtificialAnalysis fetch failed: {e}")
    
    return all_raw


async def fetch_all_news() -> list:
    """Fetch news from all RSS sources"""
    try:
        async with NewsFetcher() as f:
            return await f.fetch_all()
    except Exception as e:
        logger.error(f"News fetch failed: {e}")
        return []


async def run(dry_run: bool = False):
    """Main crawl pipeline"""
    stats = CrawlStats()
    start_time = now_iso()
    
    logger.info("=" * 60)
    logger.info("AI Leaderboard Crawler Started")
    logger.info(f"Start time: {start_time}")
    logger.info(f"Dry run: {dry_run}")
    logger.info("=" * 60)
    
    # Step 1: Fetch leaderboard data
    logger.info("[Step 1/4] Fetching leaderboard data...")
    raw_models = await fetch_all_leaderboard_data()
    
    # Count by source
    source_counts = {}
    for m in raw_models:
        source_counts[m.source] = source_counts.get(m.source, 0) + 1
    for source, count in source_counts.items():
        logger.info(f"  {source}: {count} models")
    stats.total_models = len(raw_models)
    
    # Step 2: Process leaderboard data
    logger.info("[Step 2/4] Processing leaderboard data...")
    normalized = normalize_all(raw_models)
    deduped = deduplicate_models(normalized)
    enriched = enrich_all(deduped)
    classified = classify_models(enriched)
    
    logger.info(f"  Global: {len(classified['global'])} models")
    logger.info(f"  Non-China: {len(classified['non_china'])} models")
    logger.info(f"  China: {len(classified['china'])} models")
    
    # Step 3: Fetch and process news
    logger.info("[Step 3/4] Fetching news...")
    raw_news = await fetch_all_news()
    stats.news_fetched = len(raw_news)
    processed_news = process_news(raw_news)
    stats.news_after_dedup = len(processed_news)
    
    # Step 4: Generate output files
    logger.info("[Step 4/4] Generating output files...")
    
    if not dry_run:
        # Resolve output paths
        leaderboard_path = PROJECT_ROOT / OUTPUT_LEADERBOARD
        news_path = PROJECT_ROOT / OUTPUT_NEWS
        version_path = PROJECT_ROOT / OUTPUT_VERSION
        
        generate_leaderboard_js(classified, str(leaderboard_path))
        generate_news_js(processed_news, str(news_path))
        generate_version_js(
            model_count=len(classified['global']),
            news_count=len(processed_news),
            data_sources=['LMSYS Arena', 'OpenRouter', 'Artificial Analysis'],
            news_sources=[s.name for s in NEWS_SOURCES],
            output_path=str(version_path),
        )
        logger.success("Output files generated successfully!")
    else:
        logger.info("[DRY RUN] Skipping file generation")
        logger.info(f"  Would write {len(classified['global'])} models to leaderboard.js")
        logger.info(f"  Would write {len(processed_news)} news to news.js")
        logger.info(f"  Would write version.js")
    
    # Print summary
    end_time = now_iso()
    logger.info("=" * 60)
    logger.info("CRAWL SUMMARY")
    logger.info(f"  Total raw models: {stats.total_models}")
    logger.info(f"  Global models: {len(classified['global'])}")
    logger.info(f"  Non-China models: {len(classified['non_china'])}")
    logger.info(f"  China models: {len(classified['china'])}")
    logger.info(f"  News fetched: {stats.news_fetched}")
    logger.info(f"  News after processing: {stats.news_after_dedup}")
    logger.info(f"  Start: {start_time}")
    logger.info(f"  End: {end_time}")
    logger.info("=" * 60)
    
    return stats


def main():
    import argparse
    parser = argparse.ArgumentParser(description='AI Leaderboard Crawler')
    parser.add_argument('--dry-run', action='store_true', help='Print results without writing files')
    parser.add_argument('--debug', action='store_true', help='Enable debug logging')
    args = parser.parse_args()
    
    setup_logger(debug=args.debug)
    asyncio.run(run(dry_run=args.dry_run))


if __name__ == '__main__':
    main()
