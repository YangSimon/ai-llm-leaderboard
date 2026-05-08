# AI 大模型排行榜 - 增量架构设计：爬虫与定时更新

**版本**: v1.0
**作者**: 高见远（架构师）
**日期**: 2026-05-08
**状态**: 初稿

---

## 1. 实现方案

### 1.1 技术选型

| 组件 | 选型 | 理由 |
|------|------|------|
| **爬虫语言** | Python 3.11+ | 数据处理能力强、生态成熟、脚本编写便捷 |
| **HTTP 客户端** | httpx | 异步支持、API 友好、简单易用 |
| **HTML 解析** | BeautifulSoup4 | 轻量级、适合简单页面解析 |
| **RSS 解析** | feedparser | 稳定可靠、支持多种 RSS 格式 |
| **数据序列化** | 内置 json + json5 | 保持前端 JSON 格式兼容 |
| **定时任务** | GitHub Actions cron | 免费、稳定、集成良好 |
| **数据存储** | JSON 文件 | GitHub Pages 兼容、版本控制 |

### 1.2 GitHub Actions Workflow 设计

```yaml
# .github/workflows/crawl.yml
name: AI Leaderboard Crawler

on:
  schedule:
    # 每小时执行一次 (UTC 0:00)
    - cron: '0 * * * *'
  workflow_dispatch:  # 支持手动触发
  push:
    branches:
      - main
    paths:
      - 'crawler/**'
      - '.github/workflows/crawl.yml'

jobs:
  crawl:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Cache pip packages
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('crawler/requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-

      - name: Install dependencies
        run: pip install -r crawler/requirements.txt

      - name: Run crawler
        run: python crawler/main.py
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
          LMSYS_API_KEY: ${{ secrets.LMSYS_API_KEY }}

      - name: Check for changes
        id: git-check
        run: |
          if git diff --exit-code src/data/; then
            echo "No changes detected"
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
            git diff --stat src/data/
          fi

      - name: Commit and push changes
        if: steps.git-check.outputs.changed == 'true'
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: auto-update leaderboard data - $(date -u '+%Y-%m-%d %H:%M') UTC"
          file_pattern: 'src/data/*.js'
          skip_dirty_check: false

      - name: Report crawl status
        if: steps.git-check.outputs.changed == 'true'
        run: |
          echo "Data updated successfully"
          echo "Changes committed to repository"
```

### 1.3 数据流设计

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GitHub Actions (每小时触发)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  爬取阶段 (fetchers/)                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │   LMSYS Arena     │  │  OpenRouter API  │  │  News RSS Feeds   │         │
│  │   获取排行榜      │  │  获取评分/使用量  │  │  HackerNews/MIT   │         │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘         │
└───────────┼────────────────────┼────────────────────┼───────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  数据处理阶段 (processors/)                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  ScoreNormalizer │  │   Deduplicator   │  │ NewsAggregator   │         │
│  │  评分归一化      │  │  数据去重/合并    │  │ 新闻去重/分类    │         │
│  │  0-100 映射     │  │  新模型识别      │  │ 7天保留/最多50条 │         │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘         │
└───────────┼────────────────────┼────────────────────┼───────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  数据输出阶段                                                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │ leaderboard.js   │  │   news.js        │  │ modelDetails.js  │         │
│  │ 更新模型列表     │  │  更新新闻数据     │  │ 更新/新增模型详情 │         │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘         │
└───────────┼────────────────────┼────────────────────┼───────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Git Commit & Push → 触发 GitHub Pages 重建 → 用户看到更新                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 文件列表及相对路径

### 2.1 新增文件 (crawler/)

```
crawler/
├── __init__.py                 # Python 包初始化
├── main.py                     # 主入口脚本
├── requirements.txt            # Python 依赖
├── config.py                   # 配置文件
├── models.py                   # 数据模型定义
├── fetchers/
│   ├── __init__.py
│   ├── base.py                 # 基础爬虫类
│   ├── lmsys.py                # LMSYS Chatbot Arena 爬虫
│   ├── openrouter.py           # OpenRouter API 爬虫
│   ├── artificial_analysis.py  # Artificial Analysis 爬虫
│   └── news.py                 # 新闻 RSS 爬虫
├── processors/
│   ├── __init__.py
│   ├── score_normalizer.py     # 评分归一化处理
│   ├── deduplicator.py         # 数据去重处理
│   ├── news_processor.py       # 新闻数据处理
│   └── model_enricher.py       # 模型数据丰富
└── utils/
    ├── __init__.py
    ├── logger.py               # 日志工具
    └── date_utils.py           # 日期工具
```

### 2.2 需要修改的前端文件

| 文件路径 | 修改内容 |
|----------|----------|
| `src/data/version.js` | **新增**：数据版本信息文件 |
| `src/hooks/useRefreshTimer.js` | 增强：显示数据更新时间 |

### 2.3 配置文件

```python
# crawler/config.py
"""
爬虫配置文件
"""
from dataclasses import dataclass
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

# API 数据源配置
DATA_SOURCES = [
    DataSource(
        name='LMSYS Arena',
        url='https://lmarena.ai/api/leaderboard-data',
        type='api',
        priority=1
    ),
    DataSource(
        name='OpenRouter',
        url='https://openrouter.ai/api/v1/models',
        type='api',
        priority=2
    ),
    DataSource(
        name='Artificial Analysis',
        url='https://artificialanalysis.ai/models',
        type='html',
        priority=3
    ),
]

# 新闻 RSS 数据源配置
NEWS_SOURCES = [
    NewsSource(
        name='Hacker News AI',
        url='https://hnrss.org/newest?q=AI%20OR%20LLM%20OR%20GPT',
        category='行业动态'
    ),
    NewsSource(
        name='MIT Tech Review',
        url='https://www.technologyreview.com/feed/',
        category='技术突破'
    ),
    NewsSource(
        name='VentureBeat AI',
        url='https://venturebeat.com/ai/feed/',
        category='行业动态'
    ),
    NewsSource(
        name='The Verge AI',
        url='https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
        category='产品发布'
    ),
]

# 数据保留策略
NEWS_RETENTION_DAYS = 7      # 新闻保留 7 天
NEWS_MAX_COUNT = 50          # 新闻最多 50 条

# 评分归一化配置
SCORE_NORMALIZATION = {
    'lmsys': {
        'type': 'elo',
        'min': 1000,
        'max': 1500,
        'target_min': 60,
        'target_max': 100
    }
}

# 爬取频率
CRAWL_INTERVAL_HOURS = 1     # 每小时爬取一次

# 模型公司映射 (用于分类)
COMPANY_MAPPING = {
    'OpenAI': '非中国',
    'Anthropic': '非中国',
    'Google': '非中国',
    'Meta': '非中国',
    'Mistral AI': '非中国',
    'Cohere': '非中国',
    'Microsoft': '非中国',
    '01.AI': '中国',
    'DeepSeek': '中国',
    'Alibaba': '中国',
    'Zhipu AI': '中国',
    'Moonshot AI': '中国',
    'Baichuan AI': '中国',
    'MiniMax': '中国',
    'Tencent': '中国',
    'iFlytek': '中国',
    'StepFun AI': '中国',
    'Shanghai AI Lab': '中国',
}
```

---

## 3. 数据结构和接口

### 3.1 爬虫输出 JSON 格式

#### 3.1.1 排行榜数据 (leaderboard.js)

```javascript
// globalModels / nonChinaModels / chinaModels 中的模型结构
{
  id: 'gpt-5.5',
  name: 'GPT-5.5',
  company: 'OpenAI',
  logo: '🤖',
  overallScore: 98.5,
  reasoning: 99,
  coding: 99,
  math: 99,
  multimodal: 99,
  creativeWriting: 97,
  multilingual: 98,
  contextLength: 256000,
  tags: ['最新模型', '代码生成', '推理', ...],
  description: 'OpenAI 最新一代大语言模型...',
  releaseDate: '2026-03-15',
  // ---- 新增字段 ----
  dataSource: 'lmsys',
  eloScore: 1456,
  lastUpdated: '2026-05-08T10:00:00Z'
}
```

#### 3.1.2 新闻数据 (news.js)

```javascript
// newsData 中的新闻结构
{
  id: 'news-xxx',
  title: '...',
  summary: '...',
  content: '...',
  source: 'OpenAI Blog',
  date: '2026-05-08',
  category: '产品发布',
  image: '🤖',
  // ---- 新增字段 ----
  url: 'https://...',
  author: 'OpenAI',
  lastUpdated: '2026-05-08T10:00:00Z'
}
```

#### 3.1.3 模型详情 (modelDetails.js)

```javascript
// modelDetailsData 中的详情结构 - 保持不变
{
  fullDescription: '...',
  capabilities: [...],
  useCases: [...],
  pricing: {...}
}
```

#### 3.1.4 版本信息 (version.js) - 新增

```javascript
// src/data/version.js
export const dataVersion = {
  lastUpdate: '2026-05-08T10:00:00Z',
  leaderboardUpdate: '2026-05-08T10:00:00Z',
  newsUpdate: '2026-05-08T10:00:00Z',
  leaderboardVersion: '1.0.0',
  newsVersion: '1.0.0',
  modelCount: 45,
  newsCount: 42,
  dataSources: ['LMSYS Arena', 'OpenRouter', 'Artificial Analysis'],
  newsSources: ['Hacker News', 'MIT Tech Review', 'VentureBeat'],
  cronSchedule: '0 * * * *'
};
```

### 3.2 数据转换映射关系

| 源字段 (LMSYS) | 目标字段 | 转换规则 |
|----------------|----------|----------|
| `name` | `name` | 直接复制 |
| `elo` | `eloScore` | 直接复制 |
| `elo` | `overallScore` | 归一化: `(elo - 1000) / 5` |
| `num_votes` | - | 用于权重计算 |
| `95% CI` | - | 存储但不展示 |
| `organization` | `company` | 映射公司名称 |
| `raw_name` | `id` | 转换为小写连字符格式 |

| 源字段 (OpenRouter) | 目标字段 | 转换规则 |
|---------------------|----------|----------|
| `id` | `id` | 清理前缀 |
| `name` | `name` | 直接复制 |
| `created_by` | `company` | 直接复制 |
| `rating` | `overallScore` | 乘以 20 转为百分制 |
| `context_length` | `contextLength` | 直接复制 |

### 3.3 新增字段定义

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `dataSource` | string | 数据来源标识 | `'lmsys'`, `'openrouter'` |
| `eloScore` | number | LMSYS 原始 Elo 分数 | `1456` |
| `lastUpdated` | ISO8601 | 最后爬取时间 | `'2026-05-08T10:00:00Z'` |
| `url` | string | 新闻原文链接 | `'https://...'` |
| `author` | string | 新闻作者 | `'OpenAI'` |

---

## 4. 程序调用流程

### 4.1 爬虫执行流程

```
main.py 入口
    │
    ├─► 1. 初始化日志和配置
    │       └─► logger.setup()
    │
    ├─► 2. 爬取排行榜数据
    │       ├─► lmsys.fetch() → 获取 LMSYS Arena 排名
    │       ├─► openrouter.fetch() → 获取 OpenRouter 模型列表
    │       └─► artificial_analysis.fetch() → 获取性能数据
    │
    ├─► 3. 处理排行榜数据
    │       ├─► score_normalizer.normalize() → 评分归一化
    │       ├─► deduplicator.merge() → 合并多数据源
    │       └─► model_enricher.enrich() → 数据丰富
    │
    ├─► 4. 爬取新闻数据
    │       └─► news.fetch_all() → 爬取所有 RSS 源
    │
    ├─► 5. 处理新闻数据
    │       ├─► news_processor.deduplicate() → 去重
    │       ├─► news_processor.categorize() → 自动分类
    │       └─► news_processor.prune() → 保留最近 7 天
    │
    ├─► 6. 生成输出文件
    │       ├─► generate_leaderboard.js() → 写入 leaderboard.js
    │       ├─► generate_news.js() → 写入 news.js
    │       └─► generate_version.js() → 写入 version.js
    │
    └─► 7. 输出统计信息
            └─► logger.summary() → 输出爬取统计
```

### 4.2 GitHub Actions 触发和执行流程

```
┌─────────────────────────────────────────────────────────────────┐
│ 触发条件                                                           │
├─────────────────────────────────────────────────────────────────┤
│ 1. 定时触发：每小时的第 0 分钟 (cron: '0 * * * *')              │
│ 2. 手动触发：通过 GitHub Actions 页面点击 "Run workflow"           │
│ 3. 代码推送：当 crawler/ 目录或 workflow 文件变更时               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions 执行环境                                          │
├─────────────────────────────────────────────────────────────────┤
│ - OS: ubuntu-latest                                               │
│ - Python: 3.11                                                    │
│ - 超时: 15 分钟                                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  执行步骤                                                          │
├─────────────────────────────────────────────────────────────────┤
│ 1. Checkout 代码库                                                 │
│ 2. Setup Python 3.11                                             │
│ 3. 安装依赖 (pip install -r requirements.txt)                     │
│ 4. 运行爬虫 (python main.py)                                      │
│ 5. 检查变更 (git diff src/data/)                                  │
│ 6. 如有变更，commit 并 push                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Pages 重建                                                │
├─────────────────────────────────────────────────────────────────┤
│ 提交到 main 分支 → 触发 GitHub Pages 重建 → 新数据上线            │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 数据更新到前端展示的完整链路

```
1. GitHub Actions cron 触发 (每小时)
       │
       ▼
2. 爬虫脚本从数据源获取最新数据
       │
       ▼
3. 数据处理和归一化
       │
       ▼
4. 写入 src/data/*.js 文件
       │
       ▼
5. git commit & push 到 main 分支
       │
       ▼
6. GitHub Pages 检测到变更，自动重建 (约 1-2 分钟)
       │
       ▼
7. 用户访问网站，加载最新数据
       │
       ▼
8. 前端组件渲染更新后的排行榜和新闻
```

---

## 5. 任务列表（有序、含依赖关系）

### 阶段一：基础设施

| 编号 | 任务描述 | 涉及文件 | 依赖 | 复杂度 |
|------|----------|----------|------|--------|
| **T1.1** | 创建 crawler 目录结构和 Python 包初始化 | `crawler/__init__.py`, `crawler/fetchers/__init__.py`, `crawler/processors/__init__.py`, `crawler/utils/__init__.py` | - | 低 |
| **T1.2** | 创建 requirements.txt 依赖文件 | `crawler/requirements.txt` | T1.1 | 低 |
| **T1.3** | 创建日志和日期工具模块 | `crawler/utils/logger.py`, `crawler/utils/date_utils.py` | T1.1 | 中 |
| **T1.4** | 创建配置文件 | `crawler/config.py` | - | 低 |
| **T1.5** | 创建数据模型定义 | `crawler/models.py` | T1.1 | 中 |

### 阶段二：爬虫实现

| 编号 | 任务描述 | 涉及文件 | 依赖 | 复杂度 |
|------|----------|----------|------|--------|
| **T2.1** | 实现基础爬虫类 | `crawler/fetchers/base.py` | T1.1, T1.3 | 中 |
| **T2.2** | 实现 LMSYS Arena 爬虫 | `crawler/fetchers/lmsys.py` | T2.1 | 高 |
| **T2.3** | 实现 OpenRouter API 爬虫 | `crawler/fetchers/openrouter.py` | T2.1 | 高 |
| **T2.4** | 实现 Artificial Analysis 爬虫 | `crawler/fetchers/artificial_analysis.py` | T2.1 | 中 |
| **T2.5** | 实现新闻 RSS 爬虫 | `crawler/fetchers/news.py` | T2.1 | 中 |

### 阶段三：数据处理

| 编号 | 任务描述 | 涉及文件 | 依赖 | 复杂度 |
|------|----------|----------|------|--------|
| **T3.1** | 实现评分归一化处理器 | `crawler/processors/score_normalizer.py` | T1.5 | 中 |
| **T3.2** | 实现数据去重处理器 | `crawler/processors/deduplicator.py` | T1.5 | 中 |
| **T3.3** | 实现新闻处理流程 | `crawler/processors/news_processor.py` | T1.5 | 中 |
| **T3.4** | 实现模型数据丰富器 | `crawler/processors/model_enricher.py` | T3.1, T3.2 | 中 |

### 阶段四：主程序和输出

| 编号 | 任务描述 | 涉及文件 | 依赖 | 复杂度 |
|------|----------|----------|------|--------|
| **T4.1** | 实现主程序入口 | `crawler/main.py` | T2.*, T3.* | 高 |
| **T4.2** | 实现 JS 文件生成器 | `crawler/generators/` (新增目录) | T1.5 | 中 |
| **T4.3** | 创建 version.js 模板 | `src/data/version.js` | - | 低 |

### 阶段五：CI/CD 配置

| 编号 | 任务描述 | 涉及文件 | 依赖 | 复杂度 |
|------|----------|----------|------|--------|
| **T5.1** | 创建 GitHub Actions workflow | `.github/workflows/crawl.yml` | T4.* | 中 |
| **T5.2** | 配置 GitHub Secrets (如需要) | - | T5.1 | 低 |

### 阶段六：前端集成

| 编号 | 任务描述 | 涉及文件 | 依赖 | 复杂度 |
|------|----------|----------|------|--------|
| **T6.1** | 增强 useRefreshTimer hook | `src/hooks/useRefreshTimer.js` | T4.3 | 中 |
| **T6.2** | 添加数据更新提示组件 | `src/components/DataUpdateNotice.jsx` (可选) | T6.1 | 低 |

### 阶段七：测试和部署

| 编号 | 任务描述 | 涉及文件 | 依赖 | 复杂度 |
|------|----------|----------|------|--------|
| **T7.1** | 本地测试爬虫脚本 | - | T4.* | 中 |
| **T7.2** | 手动触发 GitHub Actions 测试 | - | T5.1 | 低 |
| **T7.3** | 验证数据更新链路 | - | T7.2 | 中 |

### 依赖关系图

```
T1.1 ─┬─ T1.2 ─ T1.3 ─ T1.4 ─ T1.5 ─┬─ T2.1 ─┬─ T2.2
      │                              │        ├─ T2.3
      │                              │        ├─ T2.4
      │                              │        └─ T2.5
      │                              │
      │                              ├─ T3.1 ─┬─ T3.4
      │                              ├─ T3.2 ─┘
      │                              └─ T3.3
      │
      └──────────────────────────────────┬─ T4.1 ─ T4.2
                                          │
                                          └─ T4.3
                                              │
                                              ├─ T5.1 ─ T5.2
                                              │
                                              └─ T6.1 ─ T6.2
                                                  │
                                                  └─ T7.1 ─ T7.2 ─ T7.3
```

---

## 6. 依赖包列表

### Python 依赖 (requirements.txt)

```
# HTTP 客户端
httpx>=0.27.0

# HTML 解析
beautifulsoup4>=4.12.0
lxml>=5.0.0

# RSS 解析
feedparser>=6.0.0

# JSON 处理 (保持格式美观)
json5>=0.9.0

# 日志
loguru>=0.7.0

# 异步支持
aiofiles>=23.0.0

# 类型提示 (可选但推荐)
typing-extensions>=4.0.0
```

### 无需新增前端依赖

前端代码使用现有依赖，无需额外安装。

---

## 7. 共享知识

### 7.1 API 端点和参数

| 数据源 | 端点 | 方法 | 认证 | 响应格式 |
|--------|------|------|------|----------|
| LMSYS Arena | `https://lmarena.ai/api/leaderboard-data` | GET | 无 | JSON |
| OpenRouter | `https://openrouter.ai/api/v1/models` | GET | API Key (可选) | JSON |
| Artificial Analysis | `https://artificialanalysis.ai/models` | GET | 无 | HTML |

### 7.2 数据源的字段映射

#### LMSYS Arena → 内部模型

```python
{
    'model': 'name',
    'elo': 'eloScore',
    'organization': 'company',
    'vote_count': None,  # 存储用于分析
}
```

#### OpenRouter → 内部模型

```python
{
    'id': 'id',           # 需要清理 (去掉 'openrouter/' 前缀)
    'name': 'name',
    'created_by': 'company',
    'context_length': 'contextLength',
    'pricing': None,      # 存储用于详情页
}
```

### 7.3 错误处理策略

| 错误类型 | 处理策略 |
|----------|----------|
| 网络超时 | 重试 3 次，间隔 2s/5s/10s |
| API 返回错误 | 记录日志，跳过该数据源 |
| 数据解析失败 | 记录日志，使用空数据 |
| 文件写入失败 | 抛出异常，中断执行 |
| Rate Limit | 等待后重试 |

```python
# 错误处理示例
from loguru import logger

class CrawlerError(Exception):
    """爬虫基础异常"""
    pass

class DataSourceError(CrawlerError):
    """数据源错误"""
    pass

async def fetch_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=30.0)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error {e.response.status_code}: {url}")
            if attempt == max_retries - 1:
                raise DataSourceError(f"Failed after {max_retries} retries")
        except httpx.TimeoutException:
            logger.warning(f"Timeout, retry {attempt + 1}/{max_retries}: {url}")
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
```

### 7.4 日志规范

```python
# 日志级别规范
logger.debug()  # 详细调试信息
logger.info()   # 一般信息 (开始/完成爬取)
logger.success() # 成功信息 (数据更新成功)
logger.warning() # 警告信息 (跳过的数据)
logger.error()  # 错误信息 (失败的数据源)
logger.critical() # 严重错误 (中断执行)
```

---

## 8. 待明确事项

| 编号 | 问题 | 影响 | 建议解决方案 |
|------|------|------|--------------|
| **Q1** | OpenRouter API 是否需要认证 Key？ | 如需 Key，需配置 GitHub Secrets | 优先使用公开端点，Key 作为可选配置 |
| **Q2** | LMSYS API 是否有访问频率限制？ | 可能影响爬虫稳定性 | 添加请求间隔，优先使用官方 CSV |
| **Q3** | 是否需要保留数据变更历史？ | 影响 Git 仓库大小 | 当前方案仅保留最新数据，Git 历史即变更历史 |
| **Q4** | Artificial Analysis 页面结构是否稳定？ | 可能需要维护爬虫适配 | 优先使用 API，数据不稳定时降低优先级 |
| **Q5** | 新模型如何分配 logo 和 description？ | 当前为手动维护 | 爬虫仅更新评分，description 由人工维护或使用默认模板 |
| **Q6** | 是否需要添加数据校验机制？ | 确保数据质量 | 建议添加基本的 schema 校验 |

---

## 9. 附录

### 9.1 目录结构概览

```
ai-llm-leaderboard/
├── .github/
│   └── workflows/
│       └── crawl.yml              # 新增
├── crawler/                       # 新增目录
│   ├── __init__.py
│   ├── main.py
│   ├── requirements.txt
│   ├── config.py
│   ├── models.py
│   ├── fetchers/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── lmsys.py
│   │   ├── openrouter.py
│   │   ├── artificial_analysis.py
│   │   └── news.py
│   ├── processors/
│   │   ├── __init__.py
│   │   ├── score_normalizer.py
│   │   ├── deduplicator.py
│   │   ├── news_processor.py
│   │   └── model_enricher.py
│   ├── generators/                 # 新增目录
│   │   ├── __init__.py
│   │   └── js_generator.py
│   └── utils/
│       ├── __init__.py
│       ├── logger.py
│       └── date_utils.py
└── src/
    └── data/
        ├── leaderboard.js         # 修改
        ├── news.js                # 修改
        ├── modelDetails.js        # 修改
        └── version.js             # 新增
```

### 9.2 新增/修改文件清单

| 状态 | 文件路径 | 说明 |
|------|----------|------|
| **新增** | `crawler/__init__.py` | Python 包初始化 |
| **新增** | `crawler/main.py` | 爬虫主入口 |
| **新增** | `crawler/requirements.txt` | Python 依赖 |
| **新增** | `crawler/config.py` | 配置文件 |
| **新增** | `crawler/models.py` | 数据模型 |
| **新增** | `crawler/fetchers/__init__.py` | fetchers 包初始化 |
| **新增** | `crawler/fetchers/base.py` | 基础爬虫类 |
| **新增** | `crawler/fetchers/lmsys.py` | LMSYS 爬虫 |
| **新增** | `crawler/fetchers/openrouter.py` | OpenRouter 爬虫 |
| **新增** | `crawler/fetchers/artificial_analysis.py` | AA 爬虫 |
| **新增** | `crawler/fetchers/news.py` | 新闻爬虫 |
| **新增** | `crawler/processors/__init__.py` | processors 包初始化 |
| **新增** | `crawler/processors/score_normalizer.py` | 评分归一化 |
| **新增** | `crawler/processors/deduplicator.py` | 数据去重 |
| **新增** | `crawler/processors/news_processor.py` | 新闻处理 |
| **新增** | `crawler/processors/model_enricher.py` | 数据丰富 |
| **新增** | `crawler/generators/__init__.py` | generators 包初始化 |
| **新增** | `crawler/generators/js_generator.py` | JS 文件生成 |
| **新增** | `crawler/utils/__init__.py` | utils 包初始化 |
| **新增** | `crawler/utils/logger.py` | 日志工具 |
| **新增** | `crawler/utils/date_utils.py` | 日期工具 |
| **新增** | `.github/workflows/crawl.yml` | GitHub Actions workflow |
| **新增** | `src/data/version.js` | 数据版本信息 |
| **修改** | `src/data/leaderboard.js` | 添加新字段 |
| **修改** | `src/data/news.js` | 添加新字段 |
| **修改** | `src/hooks/useRefreshTimer.js` | 增强功能 |

---

**审批意见**：

- [ ] 架构师（高见远）：____________________ 日期：________
- [ ] 开发工程师：____________________ 日期：________
- [ ] 产品经理（许清楚）：____________________ 日期：________
