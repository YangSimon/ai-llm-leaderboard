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

# RSS news sources
NEWS_SOURCES = [
    # 官方博客 RSS
    NewsSource(name='OpenAI Blog', url='https://openai.com/news/rss.xml', category='产品发布'),
    NewsSource(name='Anthropic Blog', url='https://www.anthropic.com/news/rss.xml', category='产品发布'),
    NewsSource(name='Google AI Blog', url='https://blog.google/technology/ai/rss/', category='技术突破'),
    # 中文 AI 资讯聚合
    NewsSource(name='RadarAI', url='https://radarai.top/feed.xml', category='行业动态'),
    # RSSHub 代理的中文源（如不可用可自动跳过）
    NewsSource(name='机器之心', url='https://rsshub.app/jiqizhixin/article', category='行业动态'),
    NewsSource(name='新智元', url='https://rsshub.app/aiera/post', category='行业动态'),
    NewsSource(name='量子位', url='https://rsshub.app/qbitai/news', category='行业动态'),
    # arXiv AI 论文（Atom 格式）
    NewsSource(name='arXiv AI', url='https://export.arxiv.org/rss/cs.AI', category='技术突破'),
    NewsSource(name='arXiv CL', url='https://export.arxiv.org/rss/cs.CL', category='技术突破'),
    # 英文科技媒体
    NewsSource(name='Hacker News AI', url='https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT+OR+Claude+OR+Gemini', category='行业动态'),
    NewsSource(name='MIT Tech Review', url='https://www.technologyreview.com/feed/', category='技术突破'),
    NewsSource(name='VentureBeat AI', url='https://venturebeat.com/category/ai/feed/', category='行业动态'),
    NewsSource(name='The Verge AI', url='https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', category='产品发布'),
]

# Retention
NEWS_RETENTION_DAYS = 7
NEWS_MAX_COUNT = 50

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
