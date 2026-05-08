# AI 大模型排行榜 - 增量 PRD：爬虫与定时更新

**版本**: v1.0
**作者**: 许清楚（产品经理）
**日期**: 2026-05-08
**状态**: 待评审

---

## 1. 背景与目标

### 1.1 现状分析

当前 AI 大模型排行榜网站（https://yangsimon.github.io/ai-llm-leaderboard/）存在以下问题：

| 问题 | 影响 |
|------|------|
| 数据内置为 Mock 数据，非实时 | 用户看到的是过时信息 |
| 无自动更新机制 | 手动更新成本高且不及时 |
| 缺少最新模型（如 GPT-5.5、GLM-5.1） | 榜单不完整 |
| 缺少新模型详情数据 | 用户无法了解新模型能力 |

### 1.2 目标

1. **实时性**：每小时自动爬取最新排名数据
2. **完整性**：自动识别并添加新发布的大模型
3. **可靠性**：建立稳定的数据更新流程
4. **可追溯**：保留数据变更历史

---

## 2. 数据源分析

### 2.1 排行榜数据源

| 数据源 | URL | 可爬性评估 | 推荐方案 |
|--------|-----|-----------|---------|
| **LMSYS Chatbot Arena** | lmarena.ai | ⭐⭐⭐⭐⭐ 官方提供 API/CSV | **API 获取**，数据最权威 |
| **Artificial Analysis** | artificialanalysis.ai | ⭐⭐⭐⭐ 有公开数据页面 | **网页爬取 + API** |
| **OpenRouter** | openrouter.ai | ⭐⭐⭐⭐⭐ 官方 API | **API 获取**，含使用量/评分 |
| **Hugging Face Open LLM** | huggingface.co | ⭐⭐⭐⭐ 官方排行榜 | **API 获取** |
| **LLM Leaderboard (Reddit)** | lmarena.dev | ⭐⭐⭐ 非官方聚合 | 备用数据源 |

#### 2.1.1 LMSYS Chatbot Arena（首选）

- **数据类型**：全球大模型盲评排名
- **数据字段**：模型名、Elo 分数、95% 置信区间、投票数
- **获取方式**：
  - 官方 CSV：https://lmarena.ai/api/leaderboard-data
  - 实时 API：`curl https://lmarena.ai/api/leaderboard-data`
- **更新频率**：每日更新
- **数据质量**：⭐⭐⭐⭐⭐ 实时盲评，最权威

#### 2.1.2 Artificial Analysis（重要补充）

- **数据类型**：模型性能对比、响应速度、成本
- **数据字段**：模型名、MMLU 分数、延迟、成本、吞吐量
- **获取方式**：网页爬取 + 非官方 API
- **更新频率**：每周更新
- **数据质量**：⭐⭐⭐⭐⭐ 专业第三方评估

#### 2.1.3 OpenRouter（综合评分）

- **数据类型**：模型使用量、用户评分、API 可用性
- **数据字段**：模型名、API 路径、每日调用量、用户评分
- **获取方式**：
  - 官方 API（需 Key）：`https://openrouter.ai/api/v1/models`
  - 公开排行页：https://openrouter.ai/rankings
- **更新频率**：实时
- **数据质量**：⭐⭐⭐⭐ 真实使用数据

### 2.2 新闻数据源

| 数据源 | URL | 类型 | 推荐方案 |
|--------|-----|------|---------|
| **Hacker News AI** | news.ycombinator.com | 聚合/社区讨论 | **RSS/API 爬取** |
| **MIT Technology Review** | technologyreview.com | 科技媒体报道 | **RSS 订阅** |
| **VentureBeat AI** | venturebeat.com/category/ai | 行业新闻 | **RSS 订阅** |
| **The Verge AI** | theverge.com/ai-artificial-intelligence | 综合报道 | **RSS 订阅** |
| **Twitter/X AI KOL** | - | 实时动态 | **第三方聚合** |

### 2.3 技术可行性分析

#### 2.3.1 反爬机制评估

| 数据源 | 反爬机制 | 应对策略 |
|--------|----------|----------|
| LMSYS Arena | 无限制 | 直接 API 调用 |
| Artificial Analysis | 基础限制 | 添加 User-Agent |
| OpenRouter | API 需认证 | 使用免费 API Key |
| 新闻 RSS | 无限制 | 标准 RSS 解析 |

#### 2.3.2 GitHub Actions 限制

| 限制项 | 免费额度 | 本项目消耗估算 |
|--------|----------|----------------|
| 月度构建时间 | 2000 分钟 | ~30 分钟/月（按需） |
| 每次运行时间 | 360 分钟上限 | ~5-10 分钟/次 |
| 存储 | 0.5 GB | < 100 MB |

**结论**：免费额度完全满足需求。

---

## 3. 解决方案设计

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   定时触发   │───▶│   爬虫脚本   │───▶│   数据处理   │   │
│  │ (每1小时)   │    │  (Node.js)  │    │  (JSON转换)  │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
│                                              │              │
│                                              ▼              │
│                                    ┌─────────────────┐    │
│                                    │  提交到 GitHub   │    │
│                                    │   触发 Pages    │    │
│                                    └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Pages                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   静态网站更新                       │   │
│  │   leaderboard.json + news.json + modelDetails.json  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 数据更新策略

#### 3.2.1 排行榜数据

| 策略 | 说明 |
|------|------|
| **新数据覆盖旧数据** | 直接替换 `src/data/leaderboard.js` |
| **评分归一化** | 不同数据源评分范围不同，需要归一化到 0-100 |
| **自动识别新模型** | 检测新出现的模型，自动添加到列表 |
| **保留现有字段** | 新模型使用默认字段 + 补充爬取信息 |

#### 3.2.2 新闻数据

| 策略 | 说明 |
|------|------|
| **保留最近 7 天** | 只保留 `date` 在 7 天内的新闻 |
| **去重机制** | 基于 `title` 字段去重 |
| **自动分类** | 基于关键词自动分类（产品发布/技术突破等） |
| **最多 50 条** | 新闻数量上限 |

#### 3.2.3 模型详情

| 策略 | 说明 |
|------|------|
| **新建模型** | 爬取到新模型时创建基础详情页 |
| **详情来源** | 主要依赖爬取 + 官方文档摘要 |
| **缺失字段** | 使用占位符如"暂无详细信息" |

### 3.3 数据结构扩展

#### 3.3.1 排行榜数据结构（扩展）

```javascript
// 新增字段
{
  id: 'gpt-5.5',
  name: 'GPT-5.5',
  company: 'OpenAI',
  logo: '🤖',
  overallScore: 98.5,           // 归一化后的综合评分
  reasoning: 99,
  coding: 99,
  math: 99,
  multimodal: 99,
  creativeWriting: 97,
  multilingual: 98,
  contextLength: 256000,        // 新模型支持更长上下文
  tags: ['最新模型', '代码生成', '推理', ...],
  description: '...',
  releaseDate: '2026-03-15',    // 新增：发布时间
  dataSource: 'lmsys',          // 新增：数据来源
  eloScore: 1456,               // 新增：原始 Elo 分数
  lastUpdated: '2026-05-08T10:00:00Z'  // 新增：最后更新时间
}
```

#### 3.3.2 新闻数据结构（保持兼容）

```javascript
{
  id: 'news-xxx',
  title: '...',
  summary: '...',
  content: '...',
  source: 'OpenAI Blog',
  date: '2026-05-08',
  category: '产品发布',
  image: '🤖',
  url: 'https://...',           // 新增：原文链接
  author: 'OpenAI',             // 新增：作者
  lastUpdated: '2026-05-08T10:00:00Z'  // 新增
}
```

---

## 4. 新模型清单

### 4.1 待添加的最新模型

| 模型名称 | 公司 | 预计评分 | 优先级 | 数据来源 |
|----------|------|----------|--------|----------|
| GPT-5.5 | OpenAI | 98.5 | P0 | OpenAI 官方 + LMSYS |
| GLM-5.1 | 智谱 AI | 95.0 | P0 | 智谱官方 |
| Claude 4 Sonnet | Anthropic | 97.0 | P0 | Anthropic 官方 |
| Gemini 2.0 Ultra | Google | 96.5 | P0 | Google 官方 |
| DeepSeek-R2 | DeepSeek | 95.5 | P1 | DeepSeek 官方 |
| Qwen3 | 阿里巴巴 | 94.0 | P1 | 阿里云官方 |
| Llama-4 | Meta | 93.5 | P1 | Meta 官方 |
| Mistral-3 | Mistral AI | 92.0 | P2 | Mistral 官方 |
| Yi-2 | 零一万物 | 91.0 | P2 | 01.AI 官方 |
| MiniMax-02 | MiniMax | 90.5 | P2 | MiniMax 官方 |

### 4.2 模型数据扩展策略

```javascript
// src/data/newModels.js - 新模型数据
export const newModels = [
  {
    id: 'gpt-5.5',
    name: 'GPT-5.5',
    company: 'OpenAI',
    logo: '🤖',
    overallScore: 98.5,
    // ... 其他字段
  },
  // ...
];
```

---

## 5. GitHub Actions 定时任务设计

### 5.1 工作流配置

```yaml
# .github/workflows/crawler.yml
name: AI Leaderboard Crawler

on:
  schedule:
    # 每小时执行一次
    - cron: '0 * * * *'
  workflow_dispatch:  # 手动触发

jobs:
  crawl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Run crawler
        run: node scripts/crawler.js
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}

      - name: Commit and push
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore: auto-update leaderboard data'
          file_pattern: 'src/data/*.js'
```

### 5.2 爬虫脚本设计

```
scripts/
├── crawler.js          # 主入口
├── crawlers/
│   ├── lmsys.js        # LMSYS Arena 爬虫
│   ├── artificial-analysis.js
│   ├── openrouter.js
│   └── news.js
├── processors/
│   ├── scoreNormalizer.js   # 评分归一化
│   ├── deduplicator.js      # 去重处理
│   └── modelEnricher.js    # 模型数据丰富
└── utils/
    ├── dateUtils.js
    └── logger.js
```

### 5.3 数据更新流程

```
┌──────────────┐
│  定时触发     │
└──────┬───────┘
       ▼
┌──────────────┐    ┌──────────────┐
│  LMSYS API   │    │ OpenRouter   │
│  获取排名     │    │  API 获取    │
└──────┬───────┘    └──────┬───────┘
       │                   │
       ▼                   ▼
┌──────────────────────────────────┐
│         数据归一化处理            │
│  - 评分映射到 0-100              │
│  - 字段名称统一                  │
│  - 新模型识别                    │
└──────────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│         新闻爬取                  │
│  - RSS 解析                      │
│  - 去重/分类                     │
│  - 保留最近 7 天                 │
└──────────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│         Git Commit & Push        │
│  - 更新 src/data/*.js           │
│  - 触发 GitHub Pages 重建        │
└──────────────────────────────────┘
```

---

## 6. API vs 网页爬取对比

### 6.1 推荐方案

| 数据类型 | 推荐方案 | 理由 |
|----------|----------|------|
| 排行榜排名 | **API** | 数据权威、稳定、速度快 |
| 模型评分 | **API** | LMSYS/OpenRouter 提供公开 API |
| 新闻资讯 | **RSS** | 无反爬、标准化、易解析 |
| 模型详情 | **官方文档** | 官方 API 或网页爬取 |

### 6.2 技术栈选型

| 组件 | 选型 | 理由 |
|------|------|------|
| 爬虫语言 | Node.js | 与前端项目统一技术栈 |
| HTTP 客户端 | axios | 生态成熟、易用 |
| RSS 解析 | rss-parser | 轻量、可靠 |
| 数据存储 | JSON 文件 | GitHub Pages 兼容、版本控制 |
| 定时任务 | GitHub Actions | 免费、稳定、集成良好 |

---

## 7. 数据变更历史

### 7.1 Git 提交记录策略

每次数据更新生成格式化的 commit message：

```
chore: auto-update leaderboard data - 2026-05-08 10:00 UTC

Changes:
- Updated 3 model scores
- Added 1 new model (GPT-5.5)
- Updated 5 news items
- Removed 8 expired news

Sources:
- LMSYS Arena: 2026-05-08
- Artificial Analysis: 2026-05-08
```

### 7.2 数据版本管理

```javascript
// src/data/version.js
export const dataVersion = {
  lastUpdate: '2026-05-08T10:00:00Z',
  leaderboardVersion: '1.2.0',
  newsVersion: '1.1.0',
  modelCount: 45,
  newsCount: 42
};
```

---

## 8. 前端适配

### 8.1 数据加载调整

```javascript
// src/hooks/useRefreshTimer.js - 改造
export const useRefreshTimer = () => {
  // 保留原有功能
  // 新增：从 GitHub 获取最后更新时间

  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/yangsimon/ai-llm-leaderboard/main/src/data/version.js')
      .then(r => r.json())
      .then(data => setLastUpdateTime(data.lastUpdate));
  }, []);
};
```

### 8.2 展示最后更新时间

在页面底部或设置区域显示：

```
数据更新时间：2026-05-08 10:00 (2小时前自动更新)
数据来源：LMSYS Arena、Artificial Analysis、OpenRouter
```

---

## 9. 风险与对策

| 风险 | 概率 | 影响 | 对策 |
|------|------|------|------|
| 数据源 API 不可用 | 中 | 中 | 配置多个备用数据源 |
| GitHub Actions 超额 | 低 | 高 | 设置用量告警、优化爬虫效率 |
| 数据格式变化 | 中 | 中 | 添加数据校验、定期检查 |
| 反爬政策变化 | 低 | 中 | 遵守 robots.txt、使用 API |
| 新模型识别遗漏 | 中 | 低 | 人工审核 + 自动检测 |

---

## 10. 实施计划

### Phase 1：数据层（1-2 周）

- [ ] 搭建 GitHub Actions 环境
- [ ] 实现 LMSYS Arena 爬虫
- [ ] 实现 OpenRouter 爬虫
- [ ] 实现评分归一化逻辑
- [ ] 添加 GPT-5.5、GLM-5.1 等新模型

### Phase 2：新闻层（1 周）

- [ ] 实现新闻 RSS 爬虫
- [ ] 实现去重/分类逻辑
- [ ] 配置新闻更新频率

### Phase 3：前端集成（1 周）

- [ ] 改造前端数据加载逻辑
- [ ] 显示最后更新时间
- [ ] 添加数据源信息展示

### Phase 4：优化与监控（持续）

- [ ] 添加数据校验
- [ ] 设置异常告警
- [ ] 优化爬虫效率
- [ ] 扩展更多数据源

---

## 11. 验收标准

| 指标 | 目标 |
|------|------|
| 数据更新频率 | 每小时至少更新一次 |
| 新模型发现时间 | 发布后 24 小时内识别 |
| 排行榜模型数量 | >= 50 个模型 |
| 新闻数量 | 保持 30-50 条最新新闻 |
| 数据可用性 | >= 99% 时间可用 |
| 页面加载时间 | < 3 秒（数据大小 < 500KB） |

---

## 12. 附录

### A. 数据源 URLs 汇总

| 名称 | URL | 类型 |
|------|-----|------|
| LMSYS Arena | https://lmarena.ai/api/leaderboard-data | API/JSON |
| Artificial Analysis | https://artificialanalysis.ai/models | 网页 |
| OpenRouter Rankings | https://openrouter.ai/rankings | 网页/API |
| HuggingFace LLM | https://huggingface.co/spaces/open-llm-leaderboard | API |

### B. 新闻 RSS 源

| 名称 | RSS URL |
|------|---------|
| Hacker News AI | https://hnrss.org/newest?q=AI%20OR%20LLM |
| MIT Tech Review | https://www.technologyreview.com/feed/ |
| VentureBeat AI | https://venturebeat.com/ai/feed/ |

### C. 参考项目

- [LMSYS Chatbot Arena](https://lmarena.ai)
- [Artificial Analysis](https://artificialanalysis.ai)
- [OpenRouter](https://openrouter.ai)
- [GitHub Actions 定时任务文档](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)

---

**审批意见**：

- [ ] 产品经理：____________________ 日期：________
- [ ] 架构师：____________________ 日期：________
- [ ] 开发工程师：____________________ 日期：________
