// AI 大模型最新新闻 Mock 数据

export const newsData = [
  {
    id: 'news-001',
    title: 'OpenAI 发布 GPT-4o mini，成本降低 80%',
    summary: 'OpenAI 推出了 GPT-4o mini，这是其最具成本效益的多模态模型，API 价格相比 GPT-3.5 Turbo 降低了 80%，同时保持了强大的性能表现。',
    content: 'GPT-4o mini 是 OpenAI 最新推出的小型多模态模型，支持文本和图像处理。该模型在 MMLU 基准测试中达到了 82% 的得分，超过了 GPT-4 的早期版本。API 价格从每百万 tokens 0.5 美元降至 0.15 美元，这将大大降低开发者使用 AI 能力的门槛。',
    source: 'OpenAI Blog',
    date: '2025-05-07',
    category: '产品发布',
    image: '🤖'
  },
  {
    id: 'news-002',
    title: 'Anthropic Claude 3.5 Sonnet 创 MLE-Bench 新纪录',
    summary: 'Anthropic 宣布 Claude 3.5 Sonnet 在机器学习工程基准测试 MLE-Bench 中创下新纪录，展现了卓越的代码生成和调试能力。',
    content: 'MLE-Bench 是一个评估 AI 模型在 Kaggle 竞赛中表现的基准测试。Claude 3.5 Sonnet 在这项测试中获得了 41% 的奖牌率，超过了之前的最佳成绩 35%。这一结果证明了 Claude 系列模型在处理复杂机器学习任务方面的卓越能力。',
    source: 'Anthropic Research',
    date: '2025-05-06',
    category: '技术突破',
    image: '🧠'
  },
  {
    id: 'news-003',
    title: 'Google Gemini 1.5 Pro 支持 200 万 token 上下文',
    summary: 'Google 宣布 Gemini 1.5 Pro 的上下文窗口扩展至 200 万 token，用户可以一次性处理整本书籍或长篇代码库。',
    content: 'Gemini 1.5 Pro 现在支持高达 200 万 token 的上下文窗口，这是目前商业化模型中最长的上下文支持。用户可以上传约 150 万字的文本或数十万行代码，模型将能够理解整个上下文的细节并提供连贯的回复。这一能力对法律文档分析、长篇小说创作、代码库理解等场景具有重要意义。',
    source: 'Google AI Blog',
    date: '2025-05-05',
    category: '产品升级',
    image: '✨'
  },
  {
    id: 'news-004',
    title: 'DeepSeek-V3 在数学基准测试中超越 GPT-4o',
    summary: '深度求索发布的 DeepSeek-V3 模型在 MATH-500 和 AIME 等数学基准测试中取得了领先成绩，展现了卓越的数学推理能力。',
    content: 'DeepSeek-V3 在 MATH-500 测试中达到了 96.2% 的准确率，在 AIME 2024 数学竞赛中解决了 86.7% 的问题，两项成绩均超过了 GPT-4o 和 Claude 3.5 Sonnet。该模型采用创新的 MoE（混合专家）架构，训练效率大幅提升。',
    source: 'DeepSeek',
    date: '2025-05-04',
    category: '技术突破',
    image: '🔭'
  },
  {
    id: 'news-005',
    title: 'Meta 开源 Llama 3 405B，性能逼近 GPT-4',
    summary: 'Meta 发布了 Llama 3 4050 亿参数版本，这是目前最大的开源模型之一，在多项基准测试中逼近闭源 GPT-4 的表现。',
    content: 'Llama 3 405B 在 MMLU、HumanEval、GSM8K 等主流基准测试中的表现与 GPT-4 相差不到 5%。Meta 宣布该模型将完全开源商用，允许企业在其基础上进行微调和商业应用。这一发布对开源 AI 生态系统具有里程碑意义。',
    source: 'Meta AI',
    date: '2025-05-03',
    category: '开源发布',
    image: '🦙'
  },
  {
    id: 'news-006',
    title: '微软 Phi-4 发布，专注高质量合成数据',
    summary: '微软研究院发布 Phi-4 模型，该模型使用高质量合成数据进行训练，在保持小规模的同时实现了强大的推理能力。',
    content: 'Phi-4 是微软 Phi 系列的最新成员，延续了「用高质量数据替代大规模数据」的理念。该模型仅使用 140 亿参数，但在多数基准测试中可与十倍规模的模型竞争。微软表示，Phi-4 的训练数据中有 50% 以上是通过 AI 生成的合成数据。',
    source: 'Microsoft Research',
    date: '2025-05-02',
    category: '产品发布',
    image: '📎'
  },
  {
    id: 'news-007',
    title: '百川智能发布 Baichuan 4，中文能力全面提升',
    summary: '百川智能发布 Baichuan 4 大模型，在中文理解、文学创作、知识问答等方面实现了显著提升，中文综合能力达到国际领先水平。',
    content: 'Baichuan 4 在中文 CMMLU 基准测试中达到了 95.2% 的准确率，创造了新的记录。该模型还增强了多模态能力，支持图像理解和生成。此外，百川智能宣布与多家国内企业达成合作，将 Baichuan 4 应用于智能客服、内容创作等领域。',
    source: '百川智能',
    date: '2025-05-01',
    category: '产品发布',
    image: '🦢'
  },
  {
    id: 'news-008',
    title: 'Mistral AI 推出 Mixtral 8x22B，效率提升 40%',
    summary: 'Mistral AI 发布 Mixtral 8x22B，这是一款稀疏混合专家模型，在保持高性能的同时将推理效率提升了 40%。',
    content: 'Mixtral 8x22B 继承了 Mixtral 系列稀疏 MoE 架构的精髓，仅使用 141 亿活跃参数处理每个 token。该模型支持 65 种语言，在代码生成、数学推理方面表现优异。与同性能Dense模型相比，推理成本大幅降低。',
    source: 'Mistral AI',
    date: '2025-04-30',
    category: '产品发布',
    image: '🌪️'
  },
  {
    id: 'news-009',
    title: '通义千问 Qwen2.5 开源全家桶发布',
    summary: '阿里巴巴发布 Qwen2.5 开源系列模型，包括 0.5B 到 72B 多种规格，全面对标 GPT-4 性能。',
    content: 'Qwen2.5 系列涵盖 7 个规格的预训练模型和对应的指令微调模型，从 5 亿参数到 720 亿参数全覆盖。其中 Qwen2.5-72B 在多项国际基准测试中表现优异，代码生成能力尤为突出。阿里云还同步发布了 Qwen2.5-Coder 系列，专为代码场景优化。',
    source: '阿里云',
    date: '2025-04-29',
    category: '开源发布',
    image: '🐉'
  },
  {
    id: 'news-010',
    title: 'AI 模型在医学影像诊断中准确率超过专科医生',
    summary: '多项研究表明，经过微调的大语言模型在 X 光、CT 等医学影像诊断中的准确率已超过人类专科医生平均水平。',
    content: '哈佛医学院联合多家医疗机构发表研究，显示 GPT-4o 在胸部 X 光片异常检测中的准确率达到 95.3%，比参与研究的放射科医生平均水平高出 7 个百分点。研究人员指出，AI 可以有效辅助医生进行初步筛查，减少漏诊率。',
    source: 'Harvard Medical School',
    date: '2025-04-28',
    category: '行业应用',
    image: '🏥'
  },
  {
    id: 'news-011',
    title: '月之暗面 Kimi 启动 200 万字上下文公测',
    summary: '月之暗面宣布 Kimi 大模型支持 200 万字超长上下文进入公测阶段，用户可免费体验长文处理能力。',
    content: 'Kimi 的 200 万字上下文能力允许用户一次性上传多本长篇小说、完整代码库或数千页法律文档。这一能力对学术研究、代码审查、长文写作等场景具有重要价值。月之暗面表示，将根据用户反馈持续优化模型的长上下文理解能力。',
    source: '月之暗面',
    date: '2025-04-27',
    category: '产品升级',
    image: '🌙'
  },
  {
    id: 'news-012',
    title: 'Anthropic 融资 30 亿美元，估值达 1800 亿',
    summary: 'Anthropic 完成新一轮 30 亿美元融资，公司估值达到 1800 亿美元，成为仅次于 OpenAI 的第二大 AI 独角兽。',
    content: '本轮融资由谷歌领投，亚马逊、Salesforce 等跟投。Anthropic 表示将利用这笔资金扩大 Claude 模型的研发规模，提升算力基础设施，并加速企业市场的拓展。公司联合创始人表示，安全 AI 是 Anthropic 的核心使命，新资金将加强 AI 安全研究。',
    source: 'Anthropic',
    date: '2025-04-26',
    category: '行业动态',
    image: '💰'
  },
  {
    id: 'news-013',
    title: '智谱 AI 发布 GLM-4，全方位对标 GPT-4',
    summary: '智谱 AI 发布 GLM-4 系列模型，在综合能力、长上下文、多模态等方面全面对标 GPT-4，宣布开放 API 服务。',
    content: 'GLM-4 支持 128K 超长上下文，具备强大的多模态理解能力，中文任务表现尤为突出。智谱 AI 还发布了 GLM-4V 视觉模型，支持图像描述、视觉问答等任务。企业版 GLM-4 提供私有化部署选项，满足数据安全需求。',
    source: '智谱 AI',
    date: '2025-04-25',
    category: '产品发布',
    image: '🌲'
  },
  {
    id: 'news-014',
    title: 'GitHub Copilot 接入 GPT-4o，代码生成能力大幅提升',
    summary: 'GitHub 宣布 Copilot 将接入 OpenAI 最新 GPT-4o 模型，代码生成、补全、解释等能力将获得显著提升。',
    content: '新版 Copilot 利用 GPT-4o 的多模态能力，可以理解代码截图、手绘流程图，甚至分析错误截图自动生成修复建议。GitHub 数据显示，新版 Copilot 的代码采纳率提升了 35%，开发者满意度达到历史最高。',
    source: 'GitHub',
    date: '2025-04-24',
    category: '产品升级',
    image: '💻'
  },
  {
    id: 'news-015',
    title: '大模型推理成本年降幅达 95%',
    summary: '行业分析显示，大语言模型 API 推理成本在一年内下降了 95%，AI 应用的经济可行性大幅提升。',
    content: '根据人工智能投资银行的研究，GPT-3.5 Turbo 的价格从每千 tokens 0.002 美元降至 0.0001 美元，降幅达 98%。GPT-4o mini 的推出更是将多模态模型的价格拉至新低。成本的快速下降正在加速 AI 在各行业的普及应用。',
    source: 'AI Analytics',
    date: '2025-04-23',
    category: '行业报告',
    image: '📉'
  }
];

export const newsCategories = [
  { key: 'all', label: '全部' },
  { key: '产品发布', label: '产品发布' },
  { key: '技术突破', label: '技术突破' },
  { key: '开源发布', label: '开源发布' },
  { key: '行业动态', label: '行业动态' },
  { key: '行业应用', label: '行业应用' },
  { key: '行业报告', label: '行业报告' },
];
