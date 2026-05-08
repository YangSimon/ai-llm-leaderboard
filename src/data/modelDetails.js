// AI 大模型详细信息 Mock 数据

export const modelDetailsData = {
  'gpt-4o': {
    fullDescription: `GPT-4o 是 OpenAI 于 2024 年 5 月发布的新一代多模态大语言模型。"o" 代表 "omni"，意味着它是一个真正的多模态模型，能够统一处理文本、图像、音频和视频。

**核心能力**：
• **多模态理解**：可以同时理解和处理文本、图像、音频输入
• **实时语音交互**：支持低延迟的语音对话，响应时间接近人类对话
• **视觉推理**：在图像理解、图表分析、文档解析等方面表现卓越
• **代码生成**：业界领先的代码生成和调试能力

**技术规格**：
• 上下文窗口：128,000 tokens
• 支持语言：100+ 种语言
• 训练数据截止：2023年10月

**优势场景**：
• 复杂的多步骤任务
• 需要视觉理解的场景
• 实时语音对话
• 高质量的代码生成
• 创意写作和头脑风暴`,
    capabilities: [
      { name: '文本理解', level: 98, description: '深度理解复杂语义和上下文' },
      { name: '图像分析', level: 97, description: '识别图表、表格、流程图等' },
      { name: '代码生成', level: 98, description: '支持多种编程语言，代码质量高' },
      { name: '数学推理', level: 96, description: '解决复杂数学问题，步骤清晰' },
      { name: '创意写作', level: 95, description: '小说、剧本、诗歌等多种文体' },
      { name: '多语言', level: 96, description: '100+语言流利对话' },
    ],
    useCases: [
      '企业级 AI 助手',
      '代码开发与调试',
      '数据分析与可视化',
      '智能客服系统',
      '教育辅导工具',
      '内容创作平台'
    ],
    pricing: {
      input: '$5.00 / 1M tokens',
      output: '$15.00 / 1M tokens',
      context: '128K tokens'
    }
  },
  'claude-3-5-sonnet': {
    fullDescription: `Claude 3.5 Sonnet 是 Anthropic 于 2024 年 6 月发布的中高端模型，被认为是当时最智能的模型之一。

**核心能力**：
• **超长上下文**：200K token 上下文窗口
• **编程大师**：在代码生成、调试、重构方面表现卓越
• **创意写作**：生成高质量、有创意的文本内容
• **安全对齐**：严格遵循安全准则，避免有害输出

**技术规格**：
• 上下文窗口：200,000 tokens
• 支持语言：英语为主，兼顾客其他主流语言
• 特色：支持 PDF、Word 等文档直接解析

**优势场景**：
• 软件开发全流程支持
• 长文档分析总结
• 创意内容创作
• 需要长程推理的任务
• 企业知识库问答`,
    capabilities: [
      { name: '代码生成', level: 97, description: '多种语言，代码质量优秀' },
      { name: '长文本分析', level: 98, description: '200K上下文，精确定位信息' },
      { name: '创意写作', level: 98, description: '文风多样，创意丰富' },
      { name: '推理分析', level: 96, description: '复杂逻辑推理能力强' },
      { name: '多模态', level: 92, description: '图像理解能力良好' },
      { name: '安全对齐', level: 99, description: '严格遵守安全准则' },
    ],
    useCases: [
      '软件工程助手',
      '法律文档分析',
      '学术论文辅助',
      '创意写作工具',
      '企业知识管理',
      '智能客服升级'
    ],
    pricing: {
      input: '$3.00 / 1M tokens',
      output: '$15.00 / 1M tokens',
      context: '200K tokens'
    }
  },
  'gemini-1-5-pro': {
    fullDescription: `Gemini 1.5 Pro 是 Google 突破性的多模态模型，以其史无前例的超长上下文能力著称。

**核心能力**：
• **百万 Token 上下文**：业界领先的超长上下文支持
• **视频理解**：可以分析理解长视频内容
• **多语言**：原生支持 40+ 种语言
• **代码执行**：内置代码执行能力

**技术规格**：
• 上下文窗口：1,000,000 tokens（已扩展至 2M）
• 支持语言：40+ 主流语言
• 特色：视频理解、音频处理

**优势场景**：
• 整本书籍阅读理解
• 代码库全分析
• 长视频内容摘要
• 多语言翻译任务
• 复杂数据分析`,
    capabilities: [
      { name: '超长上下文', level: 100, description: '百万token无丢失理解' },
      { name: '视频理解', level: 95, description: '长视频内容分析与摘要' },
      { name: '多语言', level: 97, description: '40+语言原生支持' },
      { name: '代码生成', level: 92, description: '多种编程语言支持' },
      { name: '数学推理', level: 93, description: '复杂数学问题求解' },
      { name: '多模态', level: 96, description: '文本、图像、视频统一理解' },
    ],
    useCases: [
      '长视频内容分析',
      '代码库理解与重构',
      '法律文档审查',
      '多语言翻译',
      '教育培训助手',
      '研究文献综述'
    ],
    pricing: {
      input: '$1.25 / 1M tokens',
      output: '$5.00 / 1M tokens',
      context: '128K tokens'
    }
  },
  'deepseek-v3': {
    fullDescription: `DeepSeek-V3 是中国深度求索公司于 2024 年底发布的旗舰模型，在数学和代码领域达到了世界领先水平。

**核心能力**：
• **数学大师**：在 MATH-500、AIME 等竞赛中表现卓越
• **代码专家**：代码生成能力对标 GPT-4o
• **高效推理**：采用 MoE 架构，推理成本极低
• **完全开源**：权重开放下载，可商用

**技术规格**：
• 架构：MoE（混合专家），671B 总参数
• 上下文窗口：128,000 tokens
• 训练方式：FP8 高效训练

**优势场景**：
• 数学竞赛题目求解
• 代码生成与调试
• 科学研究辅助
• 高考/竞赛数学辅导
• 软件开发全流程`,
    capabilities: [
      { name: '数学推理', level: 98, description: '竞赛数学逼近满分' },
      { name: '代码生成', level: 97, description: '代码质量达到顶级水平' },
      { name: '推理能力', level: 95, description: '复杂逻辑推理能力强' },
      { name: '多语言', level: 91, description: '中英文均优秀' },
      { name: '开源免费', level: 100, description: '完全开源可商用' },
      { name: '低成本推理', level: 98, description: 'MoE架构推理高效' },
    ],
    useCases: [
      '数学辅导教育',
      '代码开发助手',
      '科学研究支持',
      '竞赛训练',
      '开源项目开发',
      '企业降本增效'
    ],
    pricing: {
      input: '开源免费',
      output: '开源免费',
      context: '128K tokens'
    }
  },
  'qwen2-5-72b': {
    fullDescription: `Qwen2.5-72B 是阿里巴巴通义千问的旗舰开源模型，在多项基准测试中达到世界一流水平。

**核心能力**：
• **中文专家**：中文理解能力业界领先
• **代码生成**：Qwen2.5-Coder 系列代码专用
• **多语言**：支持 100+ 种语言
• **长上下文**：128K 超长上下文

**技术规格**：
• 参数规模：720 亿
• 上下文窗口：128,000 tokens
• 训练数据：18 万亿 tokens

**优势场景**：
• 中文内容创作
• 跨境电商客服
• 代码开发辅助
• 文档分析与总结
• 教育培训辅助`,
    capabilities: [
      { name: '中文理解', level: 98, description: '中文能力业界领先' },
      { name: '多语言', level: 97, description: '100+语言支持' },
      { name: '代码生成', level: 92, description: '多种编程语言支持' },
      { name: '推理能力', level: 91, description: '逻辑推理能力良好' },
      { name: '创意写作', level: 91, description: '中文创意内容优秀' },
      { name: '开源可商用', level: 95, description: 'Apache 2.0 许可证' },
    ],
    useCases: [
      '中文内容创作',
      '跨境电商',
      '软件开发',
      '智能客服',
      '教育培训',
      '知识库问答'
    ],
    pricing: {
      input: '开源免费',
      output: '开源免费',
      context: '128K tokens'
    }
  },
  'moonshot-v1-128k': {
    fullDescription: `Moonshot V1 128K 是月之暗面 Kimi 的核心模型，以超长上下文和中文长文本处理能力著称。

**核心能力**：
• **超长上下文**：128K token 上下文窗口
• **长文本专家**：专精长文档理解和分析
• **中文优化**：深度优化的中文理解能力
• **联网搜索**：实时联网获取最新信息

**技术规格**：
• 上下文窗口：128,000 tokens
• 特色：长文本切片检索技术
• 能力：支持文件、网页、链接解析

**优势场景**：
• 长篇小说/书籍阅读
• 论文深度分析
• 合同/法律文档审查
• 代码库整体理解
• 多文档对比分析`,
    capabilities: [
      { name: '长文本理解', level: 97, description: '128K上下文精准理解' },
      { name: '中文创作', level: 95, description: '中文写作质量优秀' },
      { name: '联网搜索', level: 94, description: '实时获取最新信息' },
      { name: '多文档分析', level: 95, description: '跨文档信息整合' },
      { name: '代码理解', level: 88, description: '代码阅读分析良好' },
      { name: '多格式支持', level: 93, description: 'PDF/Word/Markdown等' },
    ],
    useCases: [
      '长篇小说创作',
      '学术论文辅助',
      '法律文档审查',
      '代码库理解',
      '竞品分析报告',
      '深度研究报告'
    ],
    pricing: {
      input: '$0.02 / 1K tokens',
      output: '$0.06 / 1K tokens',
      context: '128K tokens'
    }
  },
  'baichuan-4': {
    fullDescription: `Baichuan 4 是百川智能的最新旗舰大模型，在中文理解、多语言、多模态等方面达到世界先进水平。

**核心能力**：
• **中文理解**：深度优化的中文语义理解
• **多语言**：支持 40+ 种语言
• **多模态**：图像理解、生成能力兼备
• **安全对齐**：严格的内容安全审查

**技术规格**：
• 参数规模：千亿级别
• 上下文窗口：128,000 tokens
• 特色：百川智能搜索增强

**优势场景**：
• 中文智能客服
• 内容审核过滤
• 多语言翻译
• 医疗健康咨询
• 教育培训辅助`,
    capabilities: [
      { name: '中文理解', level: 96, description: '中文语义理解准确' },
      { name: '多语言', level: 95, description: '40+语言支持' },
      { name: '多模态', level: 90, description: '图文理解能力良好' },
      { name: '内容安全', level: 94, description: '严格的安全对齐' },
      { name: '创意写作', level: 91, description: '中文创意内容优秀' },
      { name: '知识问答', level: 92, description: '知识覆盖面广' },
    ],
    useCases: [
      '智能客服系统',
      '内容创作平台',
      '多语言翻译',
      '教育辅助工具',
      '医疗健康咨询',
      '金融分析报告'
    ],
    pricing: {
      input: 'API 价格待定',
      output: 'API 价格待定',
      context: '128K tokens'
    }
  },
  'llama-3-405b': {
    fullDescription: `Llama 3 405B 是 Meta 于 2024 年 7 月发布的旗舰开源大模型，是目前最强的开源模型之一。

**核心能力**：
• **超大参数**：4050 亿参数规模
• **开源可商用**：允许商业使用
• **多语言**：支持 8 种主要语言
• **代码专家**：代码生成能力突出

**技术规格**：
• 参数规模：4050 亿
• 上下文窗口：128,000 tokens
• 训练数据：15 万亿 tokens

**优势场景**：
• 企业本地部署
• 研究机构使用
• 代码开发辅助
• 多语言应用开发
• 大规模 AI 系统构建`,
    capabilities: [
      { name: '代码生成', level: 93, description: '代码质量优秀' },
      { name: '推理能力', level: 92, description: '逻辑推理能力强' },
      { name: '多语言', level: 93, description: '8种主要语言支持' },
      { name: '开源可商用', level: 100, description: 'Llama 3 Community License' },
      { name: '长上下文', level: 90, description: '128K上下文支持' },
      { name: '成本效率', level: 85, description: '需要大量计算资源' },
    ],
    useCases: [
      '企业本地部署',
      '学术研究',
      '开源社区项目',
      '代码开发',
      '数据隐私敏感场景',
      '定制化微调'
    ],
    pricing: {
      input: '开源免费',
      output: '开源免费',
      context: '128K tokens'
    }
  },
  'hunyuan-pro': {
    fullDescription: `Hunyuan Pro 是腾讯混元大模型的旗舰版本，与微信、QQ、企业微信等腾讯生态深度整合。

**核心能力**：
• **腾讯生态**：原生接入腾讯产品矩阵
• **多模态**：图像、视频理解能力突出
• **中文优化**：深度优化的中文理解
• **视频理解**：长视频内容分析

**技术规格**：
• 参数规模：千亿级别
• 上下文窗口：128,000 tokens
• 特色：腾讯云企业服务

**优势场景**：
• 微信小程序 AI 助手
• 企业微信智能客服
• 腾讯云企业应用
• 内容审核与推荐
• 游戏 AI NPC`,
    capabilities: [
      { name: '多模态', level: 93, description: '图文视频统一理解' },
      { name: '视频理解', level: 94, description: '长视频内容分析' },
      { name: '中文优化', level: 95, description: '中文能力优秀' },
      { name: '腾讯生态', level: 98, description: '深度集成腾讯产品' },
      { name: '企业服务', level: 92, description: '腾讯云企业应用' },
      { name: '内容安全', level: 93, description: '内容审核能力' },
    ],
    useCases: [
      '微信小程序 AI',
      '企业微信助手',
      '腾讯云服务',
      '内容审核系统',
      '智能客服',
      '游戏 NPC AI'
    ],
    pricing: {
      input: '联系腾讯云',
      output: '联系腾讯云',
      context: '128K tokens'
    }
  }
};

export const getModelDetail = (modelId) => {
  return modelDetailsData[modelId] || {
    fullDescription: '暂无详细信息',
    capabilities: [],
    useCases: [],
    pricing: {}
  };
};
