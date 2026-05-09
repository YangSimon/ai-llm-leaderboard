from dataclasses import dataclass, field
from typing import List

@dataclass
class DataSource:
    name: str
    url: str
    type: str  # 'api' | 'rss' | 'html'
    priority: int

@dataclass
class NewsSource:
    name: str
    url: str
    category: str

# API data sources
DATA_SOURCES = [
    DataSource(name='LMSYS Arena', url='https://lmarena.ai/api/leaderboard-data', type='api', priority=1),
    DataSource(name='OpenRouter', url='https://openrouter.ai/api/v1/models', type='api', priority=2),
    DataSource(name='Artificial Analysis', url='https://artificialanalysis.ai/models', type='html', priority=3),
]

# RSS news sources - 使用更可靠的源
NEWS_SOURCES = [
    # 官方博客 RSS (高优先级，最可靠)
    NewsSource(name='OpenAI Blog', url='https://openai.com/news/rss.xml', category='产品发布'),
    NewsSource(name='Anthropic Blog', url='https://www.anthropic.com/news/rss.xml', category='产品发布'),
    NewsSource(name='Google AI Blog', url='https://blog.google/technology/ai/rss/', category='技术突破'),
    NewsSource(name='Meta AI Blog', url='https://ai.meta.com/blog/rss/', category='技术突破'),
    
    # arXiv AI 论文（Atom 格式）- 学术前沿
    NewsSource(name='arXiv AI', url='https://export.arxiv.org/rss/cs.AI', category='技术突破'),
    NewsSource(name='arXiv CL', url='https://export.arxiv.org/rss/cs.CL', category='技术突破'),
    NewsSource(name='arXiv LG', url='https://export.arxiv.org/rss/cs.LG', category='技术突破'),
    
    # 英文科技媒体 - 可靠的新闻源
    NewsSource(name='MIT Tech Review', url='https://www.technologyreview.com/feed/', category='技术突破'),
    NewsSource(name='VentureBeat AI', url='https://venturebeat.com/category/ai/feed/', category='行业动态'),
    NewsSource(name='The Verge AI', url='https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', category='产品发布'),
    NewsSource(name='TechCrunch AI', url='https://techcrunch.com/category/artificial-intelligence/feed/', category='行业动态'),
    NewsSource(name='Wired AI', url='https://www.wired.com/tag/artificial-intelligence/feed/', category='技术突破'),
    
    # Hacker News AI 相关
    NewsSource(name='Hacker News AI', url='https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT+OR+Claude+OR+Gemini', category='行业动态'),
    
    # 中文 AI 资讯 - 使用更稳定的源
    NewsSource(name='机器之心', url='https://www.jiqizhixin.com/rss', category='行业动态'),
    NewsSource(name='量子位', url='https://www.qbitai.com/feed', category='行业动态'),
    NewsSource(name='InfoQ AI', url='https://www.infoq.cn/feed/ai', category='行业动态'),
    
    # 中文 AI 聚合 (备用)
    NewsSource(name='RadarAI', url='https://radarai.top/feed.xml', category='行业动态'),
]

# Retention - 保留30天的新闻，确保有足够内容
NEWS_RETENTION_DAYS = 30
NEWS_MAX_COUNT = 100

# Score normalization
ELO_MIN = 900
ELO_MAX = 1400

# Crawl interval
CRAWL_INTERVAL_HOURS = 1

# Company to region mapping
COMPANY_REGION = {
    'OpenAI': 'non_china', 'Anthropic': 'non_china', 'Google': 'non_china',
    'Meta': 'non_china', 'Mistral AI': 'non_china', 'Cohere': 'non_china',
    'Microsoft': 'non_china', 'Amazon': 'non_china', 'Nvidia': 'non_china',
    'xAI': 'non_china', 'Databricks': 'non_china',
    'DeepSeek': 'china', 'Alibaba': 'china', 'Zhipu AI': 'china',
    'Moonshot AI': 'china', 'Baichuan AI': 'china', 'MiniMax': 'china',
    'Tencent': 'china', 'iFlytek': 'china', 'StepFun AI': 'china',
    'Shanghai AI Lab': 'china', '01.AI': 'china', 'ByteDance': 'china',
    'SenseTime': 'china', 'Baidu': 'china', 'Yi': 'china',
    'Qwen': 'china', 'GLM': 'china', 'Kimi': 'china',
}

# Company to logo mapping
COMPANY_LOGO = {
    'OpenAI': '🤖', 'Anthropic': '🧠', 'Google': '💎', 'Meta': '🔗',
    'Mistral AI': '🌬️', 'Cohere': '🌊', 'Microsoft': '🪟', 'Nvidia': '🟢',
    'DeepSeek': '🔍', 'Alibaba': '🟠', 'Zhipu AI': '🔬', 'Moonshot AI': '🌙',
    'Baichuan AI': '⛰️', 'MiniMax': '🎮', 'Tencent': '🐧', 'iFlytek': '🎤',
    'StepFun AI': '🚶', 'Shanghai AI Lab': '🏛️', '01.AI': '🌟', 'ByteDance': '🎵',
    'Baidu': '🐾', 'Amazon': '📦',
    'xAI': '⚡', 'Databricks': '🧱',
}

# Default logo
DEFAULT_LOGO = '🤖'

# Output paths (relative to project root)
OUTPUT_LEADERBOARD = 'src/data/leaderboard.js'
OUTPUT_NEWS = 'src/data/news.js'
OUTPUT_MODEL_DETAILS = 'src/data/modelDetails.js'
OUTPUT_VERSION = 'src/data/version.js'
