from dataclasses import dataclass, field
from typing import Optional, List, Dict

@dataclass
class RawModel:
    """Raw model data from a single data source"""
    name: str
    company: str
    source: str  # 'lmsys' | 'openrouter' | 'artificial_analysis' | 'manual'
    elo_score: Optional[float] = None
    overall_score: Optional[float] = None
    reasoning: Optional[float] = None
    coding: Optional[float] = None
    math: Optional[float] = None
    multimodal: Optional[float] = None
    creative_writing: Optional[float] = None
    multilingual: Optional[float] = None
    context_length: Optional[int] = None
    vote_count: Optional[int] = None
    extra: Dict = field(default_factory=dict)

@dataclass
class ProcessedModel:
    """Processed model ready for frontend"""
    id: str
    name: str
    company: str
    logo: str
    overallScore: float
    reasoning: float
    coding: float
    math: float
    multimodal: float
    creativeWriting: float
    multilingual: float
    contextLength: int
    tags: List[str]
    description: str
    releaseDate: str
    dataSource: str = ''
    eloScore: Optional[float] = None
    lastUpdated: str = ''

@dataclass
class RawNews:
    """Raw news item from RSS"""
    title: str
    summary: str
    link: str
    published: str
    source_name: str
    author: str = ''

@dataclass
class ProcessedNews:
    """Processed news ready for frontend"""
    id: str
    title: str
    summary: str
    content: str
    source: str
    date: str
    category: str
    image: str
    url: str = ''
    author: str = ''
    lastUpdated: str = ''

@dataclass
class CrawlStats:
    """Crawl statistics"""
    lmsys_models: int = 0
    openrouter_models: int = 0
    aa_models: int = 0
    news_fetched: int = 0
    news_after_dedup: int = 0
    total_models: int = 0
    new_models: int = 0
    errors: List[str] = field(default_factory=list)
