"""
Manually curated model data that supplements crawled data.
This provides accurate release dates, rich descriptions, precise tags,
and dimension scores for major models that the crawler can't determine automatically.

Used by model_enricher.py to merge with crawled data.
"""

# Keyed by model ID (slugified name)
MANUAL_MODELS = {
    # ===== 2026 Flagship Models =====
    'gpt-5-5': {
        'name': 'GPT-5.5 Instant',
        'company': 'OpenAI',
        'overallScore': 99.2,
        'reasoning': 99,
        'coding': 99,
        'math': 99,
        'multimodal': 99,
        'creativeWriting': 98,
        'multilingual': 99,
        'contextLength': 1000000,
        'tags': ['旗舰', '多模态', '百万上下文', '最新模型', 'ChatGPT默认'],
        'description': (
            'OpenAI 于2026年5月发布的旗舰模型，幻觉率降低52.5%，'
            '支持百万字上下文，推理速度与长文本能力显著提升，为 ChatGPT 默认模型。'
        ),
        'releaseDate': '2026-05-01',
    },
    'claude-4-7-opus': {
        'name': 'Claude 4.7 Opus',
        'company': 'Anthropic',
        'overallScore': 98.1,
        'reasoning': 98,
        'coding': 99,
        'math': 97,
        'multimodal': 96,
        'creativeWriting': 97,
        'multilingual': 96,
        'contextLength': 1000000,
        'tags': ['旗舰', '百万上下文', '编程顶尖', '安全对齐', 'Computer Use'],
        'description': (
            'Anthropic 2026年旗舰模型，支持1M上下文，'
            '编程基准测试顶尖水平，安全合规能力业界领先，支持 Computer Use。'
        ),
        'releaseDate': '2026-04-20',
    },
    'gemini-3-1-ultra': {
        'name': 'Gemini 3.1 Ultra',
        'company': 'Google',
        'overallScore': 97.8,
        'reasoning': 98,
        'coding': 97,
        'math': 98,
        'multimodal': 99,
        'creativeWriting': 95,
        'multilingual': 98,
        'contextLength': 1000000,
        'tags': ['旗舰', '原生多模态', '百万上下文', '3D理解', '长文档'],
        'description': (
            'Google 最新一代 Gemini 3.1 Ultra，原生多模态架构，'
            '支持1M上下文，在长文档理解与3D理解方面表现突出。'
        ),
        'releaseDate': '2026-03-15',
    },
    'grok-4-2': {
        'name': 'Grok 4.2',
        'company': 'xAI',
        'overallScore': 96.5,
        'reasoning': 97,
        'coding': 96,
        'math': 95,
        'multimodal': 94,
        'creativeWriting': 93,
        'multilingual': 92,
        'contextLength': 256000,
        'tags': ['实时数据', 'X平台接入', '推理强', '风格开放', '最新模型'],
        'description': (
            'xAI Grok 4.2，实时接入 X 平台数据，推理能力强劲，风格开放自由，支持256K上下文。'
        ),
        'releaseDate': '2026-02-10',
    },
    'deepseek-v4': {
        'name': 'DeepSeek-V4',
        'company': 'DeepSeek',
        'overallScore': 96.2,
        'reasoning': 98,
        'coding': 98,
        'math': 99,
        'multimodal': 88,
        'creativeWriting': 90,
        'multilingual': 92,
        'contextLength': 128000,
        'tags': ['开源', '数学顶尖', '代码生成', '高性价比', 'API降价90%'],
        'description': (
            '深度求索2026年5月发布的旗舰模型，API价格最高降低90%，'
            '在数学和编程方面达到世界顶尖水平，性价比极高。'
        ),
        'releaseDate': '2026-05-06',
    },

    # ===== Chinese Flagship Models =====
    'qwen4-72b': {
        'name': 'Qwen4-72B',
        'company': 'Alibaba',
        'overallScore': 95.0,
        'reasoning': 95,
        'coding': 96,
        'math': 94,
        'multimodal': 95,
        'creativeWriting': 92,
        'multilingual': 96,
        'contextLength': 128000,
        'tags': ['中文优化', '多模态', '长文本优化', '代码生成', '最新模型'],
        'description': (
            '阿里通义千问 Qwen4 系列旗舰模型，中文理解能力极强，多模态与长文本处理全面优化。'
        ),
        'releaseDate': '2026-04-20',
    },
    'doubao-4-0': {
        'name': 'Doubao 4.0',
        'company': 'ByteDance',
        'overallScore': 94.2,
        'reasoning': 93,
        'coding': 92,
        'math': 91,
        'multimodal': 94,
        'creativeWriting': 96,
        'multilingual': 93,
        'contextLength': 128000,
        'tags': ['对话流畅', '多模态', '工具调用', '创意写作', '最新模型'],
        'description': (
            '字节豆包 Doubao 4.0，对话流畅自然，多模态与工具调用能力大幅提升，创意写作表现突出。'
        ),
        'releaseDate': '2026-03-10',
    },
    'glm-4-5': {
        'name': 'GLM-4.5',
        'company': 'Zhipu AI',
        'overallScore': 93.8,
        'reasoning': 95,
        'coding': 94,
        'math': 96,
        'multimodal': 92,
        'creativeWriting': 91,
        'multilingual': 94,
        'contextLength': 128000,
        'tags': ['学术优秀', '编程强', '长文本', '复杂推理', '最新模型'],
        'description': (
            '智谱 GLM-4.5，学术研究与编程表现卓越，支持长文本与复杂推理，中文理解能力突出。'
        ),
        'releaseDate': '2026-04-05',
    },
    'step-3-5': {
        'name': 'Step-3.5',
        'company': 'StepFun AI',
        'overallScore': 92.5,
        'reasoning': 93,
        'coding': 95,
        'math': 95,
        'multimodal': 88,
        'creativeWriting': 89,
        'multilingual': 90,
        'contextLength': 128000,
        'tags': ['代码强', '数学推理', '开源生态', '最新模型'],
        'description': (
            '阶跃星辰 Step 3.5，代码与数学推理能力突出，开源生态活跃，受到开发者广泛欢迎。'
        ),
        'releaseDate': '2026-03-28',
    },
    'kimi-2-5': {
        'name': 'Kimi 2.5',
        'company': 'Moonshot AI',
        'overallScore': 92.0,
        'reasoning': 93,
        'coding': 90,
        'math': 91,
        'multimodal': 93,
        'creativeWriting': 94,
        'multilingual': 91,
        'contextLength': 200000,
        'tags': ['长文档分析', '文件上传', '深度问答', '最新模型'],
        'description': (
            '月之暗面 Kimi 2.5，长文档分析能力极强，支持文件上传与深度问答，多轮对话表现优秀。'
        ),
        'releaseDate': '2026-04-15',
    },

    # ===== Older Major Models =====
    'gpt-4o': {
        'name': 'GPT-4o',
        'company': 'OpenAI',
        'overallScore': 93.5,
        'reasoning': 94,
        'coding': 95,
        'math': 93,
        'multimodal': 97,
        'creativeWriting': 93,
        'multilingual': 95,
        'contextLength': 128000,
        'tags': ['代码生成', '数学推理', '多模态', '创意写作', '多语言'],
        'description': (
            'OpenAI 多模态大语言模型，支持文本、图像、音频的统一处理，在各项基准测试中表现卓越。'
        ),
        'releaseDate': '2024-05-13',
    },
    'claude-3-5-sonnet': {
        'name': 'Claude 3.5 Sonnet',
        'company': 'Anthropic',
        'overallScore': 92.6,
        'reasoning': 93,
        'coding': 95,
        'math': 91,
        'multimodal': 92,
        'creativeWriting': 96,
        'multilingual': 93,
        'contextLength': 200000,
        'tags': ['代码生成', '长文本分析', '创意写作', '安全对齐'],
        'description': (
            'Anthropic 最智能的模型，在编程和创意写作方面表现突出，支持超长上下文窗口。'
        ),
        'releaseDate': '2024-06-20',
    },
    'gpt-4-turbo': {
        'name': 'GPT-4 Turbo',
        'company': 'OpenAI',
        'overallScore': 91.2,
        'reasoning': 92,
        'coding': 94,
        'math': 92,
        'multimodal': 88,
        'creativeWriting': 91,
        'multilingual': 93,
        'contextLength': 128000,
        'tags': ['代码生成', '数学推理', '快速响应', '多语言'],
        'description': 'GPT-4 的优化版本，提供更快的响应速度和更低的成本，性能表现优异。',
        'releaseDate': '2024-04-12',
    },
    'claude-3-opus': {
        'name': 'Claude 3 Opus',
        'company': 'Anthropic',
        'overallScore': 90.4,
        'reasoning': 93,
        'coding': 92,
        'math': 93,
        'multimodal': 90,
        'creativeWriting': 94,
        'multilingual': 91,
        'contextLength': 200000,
        'tags': ['复杂推理', '代码生成', '创意写作', '长文本分析'],
        'description': (
            'Anthropic 最强大的模型，专为复杂任务设计，在研究生级别推理方面表现最佳。'
        ),
        'releaseDate': '2024-03-04',
    },
    'llama-3-405b': {
        'name': 'Llama 3 405B',
        'company': 'Meta',
        'overallScore': 89.8,
        'reasoning': 90,
        'coding': 91,
        'math': 88,
        'multimodal': 85,
        'creativeWriting': 90,
        'multilingual': 92,
        'contextLength': 128000,
        'tags': ['开源', '代码生成', '多语言', '推理'],
        'description': 'Meta 最新开源大模型，4050亿参数，是目前最强的开源模型之一。',
        'releaseDate': '2024-07-23',
    },
    'deepseek-v3': {
        'name': 'DeepSeek-V3',
        'company': 'DeepSeek',
        'overallScore': 90.0,
        'reasoning': 93,
        'coding': 96,
        'math': 97,
        'multimodal': 82,
        'creativeWriting': 88,
        'multilingual': 90,
        'contextLength': 128000,
        'tags': ['数学', '代码生成', '推理', '开源', '高效'],
        'description': (
            '深度求索最新旗舰模型，在数学和代码生成方面达到世界领先水平，采用创新的MoE架构。'
        ),
        'releaseDate': '2024-12-26',
    },
    'mistral-large': {
        'name': 'Mistral Large 2',
        'company': 'Mistral AI',
        'overallScore': 88.5,
        'reasoning': 90,
        'coding': 89,
        'math': 89,
        'multimodal': 82,
        'creativeWriting': 87,
        'multilingual': 93,
        'contextLength': 128000,
        'tags': ['开源', '多语言', '高效推理', '代码生成'],
        'description': 'Mistral AI 旗舰模型，在保持开源优势的同时提供顶级性能。',
        'releaseDate': '2024-07-29',
    },
    'qwen2-5-72b': {
        'name': 'Qwen2.5-72B',
        'company': 'Alibaba',
        'overallScore': 89.0,
        'reasoning': 90,
        'coding': 91,
        'math': 89,
        'multimodal': 88,
        'creativeWriting': 89,
        'multilingual': 95,
        'contextLength': 128000,
        'tags': ['中文优化', '多语言', '代码生成', '开源'],
        'description': '阿里巴巴通义千问最强开源模型，中英文表现均达到世界一流水平。',
        'releaseDate': '2024-09-19',
    },
    'gpt-4o-mini': {
        'name': 'GPT-4o mini',
        'company': 'OpenAI',
        'overallScore': 85.2,
        'reasoning': 86,
        'coding': 87,
        'math': 84,
        'multimodal': 85,
        'creativeWriting': 84,
        'multilingual': 87,
        'contextLength': 128000,
        'tags': ['低成本', '多模态', '快速响应', '高性价比'],
        'description': 'OpenAI 最具成本效益的多模态模型，小型应用的最佳选择。',
        'releaseDate': '2024-07-18',
    },
    'gemini-1-5-pro': {
        'name': 'Gemini 1.5 Pro',
        'company': 'Google',
        'overallScore': 90.8,
        'reasoning': 91,
        'coding': 90,
        'math': 91,
        'multimodal': 94,
        'creativeWriting': 90,
        'multilingual': 95,
        'contextLength': 1000000,
        'tags': ['超长上下文', '多模态', '多语言', '视频理解'],
        'description': (
            'Google 突破性的多模态模型，支持100万token的超长上下文，在视频理解方面表现卓越。'
        ),
        'releaseDate': '2024-05-14',
    },
}


# Model detail data (full descriptions, capabilities, use cases, pricing).
# Keyed by model ID. These supplement the leaderboard data for the detail modal.
MODEL_DETAILS = {
    'gpt-5-5': {
        'fullDescription': (
            'GPT-5.5 Instant 是 OpenAI 于 2026 年 5 月发布的旗舰模型，'
            '带来多项突破性改进。幻觉率降低 52.5%，支持百万字上下文窗口，'
            '推理速度与长文本处理能力显著提升。作为 ChatGPT 的默认模型，'
            '它在编程、数学、多模态理解和创意生成等各个维度都达到了新的高度。\n\n'
            '**核心升级**：\n'
            '• 幻觉率降低 52.5%，可靠性大幅提升\n'
            '• 支持 1,000,000 token 上下文窗口\n'
            '• 推理速度提升，响应更快\n'
            '• 多模态能力全面增强\n\n'
            '**适用场景**：复杂推理、长文档分析、代码开发、多模态任务、企业级应用'
        ),
        'capabilities': [
            {'name': '推理分析', 'level': 99, 'description': '复杂多步推理，接近人类专家水平'},
            {'name': '代码生成', 'level': 99, 'description': '全栈开发，多语言支持，代码质量极高'},
            {'name': '数学推理', 'level': 99, 'description': '高等数学、证明推导、数学建模'},
            {'name': '多模态理解', 'level': 99, 'description': '图文音视频统一理解与生成'},
            {'name': '创意写作', 'level': 98, 'description': '长文创作、剧本、诗歌等多种文体'},
            {'name': '多语言', 'level': 99, 'description': '100+语言流利对话与翻译'},
        ],
        'useCases': [
            '企业级 AI 助手', '复杂代码开发', '科研数据分析',
            '长文档处理', '多模态内容创作', '智能教育辅导',
        ],
        'pricing': {'input': '$2.50 / 1M tokens', 'output': '$10.00 / 1M tokens', 'context': '1M tokens'},
    },
    'claude-4-7-opus': {
        'fullDescription': (
            'Claude 4.7 Opus 是 Anthropic 于 2026 年 4 月发布的旗舰模型。'
            '支持 1M token 上下文窗口，在编程基准测试中达到顶尖水平，'
            '安全合规能力业界领先。支持 Computer Use 功能，可以直接操作计算机界面。\n\n'
            '**核心能力**：\n'
            '• 百万级上下文窗口，长文档处理能力卓越\n'
            '• 编程能力在各基准测试中名列前茅\n'
            '• 内置安全对齐机制，合规可靠\n'
            '• Computer Use 功能，可操作图形界面\n\n'
            '**适用场景**：企业软件开发、安全合规场景、长文档分析、自动化操作'
        ),
        'capabilities': [
            {'name': '代码生成', 'level': 99, 'description': '多语言编程，代码质量业界顶尖'},
            {'name': '推理分析', 'level': 98, 'description': '复杂逻辑推理，多步规划'},
            {'name': '长文本分析', 'level': 99, 'description': '1M上下文，精确定位信息'},
            {'name': '安全对齐', 'level': 99, 'description': '严格的安全准则与合规能力'},
            {'name': '创意写作', 'level': 97, 'description': '高质量内容创作，文风多样'},
            {'name': '多模态', 'level': 96, 'description': '图像理解与文档解析'},
        ],
        'useCases': [
            '企业软件开发', '安全合规审查', '法律文档分析',
            'Computer Use 自动化', '长文档处理', '学术研究辅助',
        ],
        'pricing': {'input': '$15.00 / 1M tokens', 'output': '$75.00 / 1M tokens', 'context': '1M tokens'},
    },
    'gpt-4o': {
        'fullDescription': (
            'GPT-4o 是 OpenAI 于 2024 年 5 月发布的新一代多模态大语言模型。'
            '"o" 代表 "omni"，意味着它是一个真正的多模态模型，'
            '能够统一处理文本、图像、音频和视频。\n\n'
            '**核心能力**：\n'
            '• 多模态理解：同时处理文本、图像、音频输入\n'
            '• 实时语音交互：低延迟语音对话\n'
            '• 视觉推理：图像理解、图表分析、文档解析\n'
            '• 代码生成：业界领先的代码生成和调试能力\n\n'
            '**技术规格**：上下文窗口 128K tokens，支持 100+ 语言'
        ),
        'capabilities': [
            {'name': '文本理解', 'level': 98, 'description': '深度理解复杂语义和上下文'},
            {'name': '图像分析', 'level': 97, 'description': '识别图表、表格、流程图等'},
            {'name': '代码生成', 'level': 98, 'description': '支持多种编程语言，代码质量高'},
            {'name': '数学推理', 'level': 96, 'description': '解决复杂数学问题，步骤清晰'},
            {'name': '创意写作', 'level': 95, 'description': '小说、剧本、诗歌等多种文体'},
            {'name': '多语言', 'level': 96, 'description': '100+语言流利对话'},
        ],
        'useCases': [
            '企业级 AI 助手', '代码开发与调试', '数据分析与可视化',
            '智能客服系统', '教育辅导工具', '内容创作平台',
        ],
        'pricing': {'input': '$5.00 / 1M tokens', 'output': '$15.00 / 1M tokens', 'context': '128K tokens'},
    },
    'claude-3-5-sonnet': {
        'fullDescription': (
            'Claude 3.5 Sonnet 是 Anthropic 于 2024 年 6 月发布的中高端模型，'
            '在编程和创意写作方面表现突出。支持 200K token 上下文窗口。\n\n'
            '**核心能力**：\n'
            '• 超长上下文：200K token 上下文窗口\n'
            '• 编程大师：代码生成、调试、重构\n'
            '• 创意写作：高质量、有创意的文本内容\n'
            '• 安全对齐：严格遵循安全准则\n\n'
            '**适用场景**：软件开发全流程支持、长文档分析总结、创意内容创作'
        ),
        'capabilities': [
            {'name': '代码生成', 'level': 97, 'description': '多种语言，代码质量优秀'},
            {'name': '长文本分析', 'level': 98, 'description': '200K上下文，精确定位信息'},
            {'name': '创意写作', 'level': 98, 'description': '文风多样，创意丰富'},
            {'name': '推理分析', 'level': 96, 'description': '复杂逻辑推理能力强'},
            {'name': '多模态', 'level': 92, 'description': '图像理解能力良好'},
            {'name': '安全对齐', 'level': 99, 'description': '严格遵守安全准则'},
        ],
        'useCases': [
            '软件工程助手', '法律文档分析', '学术论文辅助',
            '创意写作工具', '企业知识管理', '智能客服升级',
        ],
        'pricing': {'input': '$3.00 / 1M tokens', 'output': '$15.00 / 1M tokens', 'context': '200K tokens'},
    },
    'llama-3-405b': {
        'fullDescription': (
            'Llama 3 405B 是 Meta 于 2024 年 7 月发布的开源大语言模型，'
            '拥有 4050 亿参数，是目前最强的开源模型之一。\n\n'
            '**核心能力**：\n'
            '• 超大参数：4050 亿参数规模\n'
            '• 开源可商用：允许商业使用\n'
            '• 多语言：支持 8 种主要语言\n'
            '• 代码专家：代码生成能力突出\n\n'
            '**适用场景**：企业本地部署、研究机构使用、代码开发辅助、定制化微调'
        ),
        'capabilities': [
            {'name': '代码生成', 'level': 93, 'description': '代码质量优秀'},
            {'name': '推理能力', 'level': 92, 'description': '逻辑推理能力强'},
            {'name': '多语言', 'level': 93, 'description': '8种主要语言支持'},
            {'name': '开源可商用', 'level': 100, 'description': 'Llama 3 Community License'},
            {'name': '长上下文', 'level': 90, 'description': '128K上下文支持'},
            {'name': '成本效率', 'level': 85, 'description': '需要大量计算资源'},
        ],
        'useCases': [
            '企业本地部署', '学术研究', '开源社区项目',
            '代码开发', '数据隐私敏感场景', '定制化微调',
        ],
        'pricing': {'input': '开源免费', 'output': '开源免费', 'context': '128K tokens'},
    },
    'deepseek-v4': {
        'fullDescription': (
            'DeepSeek-V4 是深度求索于 2026 年 5 月发布的旗舰模型。'
            'API 价格最高降低 90%，在数学和编程方面达到世界顶尖水平，'
            '性价比极高。采用创新的 MoE 架构，以较小的计算成本提供强大性能。\n\n'
            '**核心优势**：\n'
            '• 数学推理世界顶尖\n'
            '• 代码生成堪比最强闭源模型\n'
            '• API 价格大幅降低，性价比极高\n'
            '• 开源可商用\n\n'
            '**适用场景**：数学研究、代码开发、学术研究、高性价比 AI 应用'
        ),
        'capabilities': [
            {'name': '数学推理', 'level': 99, 'description': '世界顶尖水平，数学竞赛级'},
            {'name': '代码生成', 'level': 98, 'description': '多语言编程，质量优秀'},
            {'name': '推理分析', 'level': 98, 'description': '深度推理，链式思考'},
            {'name': '多语言', 'level': 92, 'description': '中英文为主，兼顾主流语言'},
            {'name': '成本效率', 'level': 99, 'description': 'API降价90%，性价比极高'},
            {'name': '开源', 'level': 95, 'description': '模型权重开源，可商用'},
        ],
        'useCases': [
            '数学竞赛训练', '代码开发', '学术研究',
            '高性价比应用', '教育辅导', '开源项目',
        ],
        'pricing': {'input': '¥2.00 / 1M tokens', 'output': '¥8.00 / 1M tokens', 'context': '128K tokens'},
    },
    'deepseek-v3': {
        'fullDescription': (
            'DeepSeek-V3 是深度求索于 2024 年 12 月发布的旗舰模型，'
            '在数学和代码生成方面达到世界领先水平，采用创新的 MoE 架构。\n\n'
            '**核心能力**：\n'
            '• 数学推理：世界顶级水平\n'
            '• 代码生成：多语言编程能力强\n'
            '• MoE 架构：高效推理，成本低\n'
            '• 开源可商用\n\n'
            '**适用场景**：数学研究、代码开发、学术论文、高性价比应用'
        ),
        'capabilities': [
            {'name': '数学推理', 'level': 97, 'description': '世界领先水平'},
            {'name': '代码生成', 'level': 96, 'description': '多语言支持，质量高'},
            {'name': '推理分析', 'level': 93, 'description': '深度推理能力'},
            {'name': '多语言', 'level': 90, 'description': '中英文为主'},
            {'name': '成本效率', 'level': 95, 'description': 'MoE架构高效推理'},
            {'name': '开源', 'level': 95, 'description': '模型权重开源'},
        ],
        'useCases': [
            '数学研究', '代码开发', '学术论文',
            '高性价比应用', '教育辅导', '开源社区',
        ],
        'pricing': {'input': '¥1.00 / 1M tokens', 'output': '¥4.00 / 1M tokens', 'context': '128K tokens'},
    },
    'hunyuan-pro': {
        'fullDescription': (
            'Hunyuan Pro 是腾讯混元大模型的旗舰版本，与微信、QQ、企业微信等'
            '腾讯生态深度整合。多模态能力突出，视频理解能力强。\n\n'
            '**核心能力**：\n'
            '• 腾讯生态：原生接入腾讯产品矩阵\n'
            '• 多模态：图像、视频理解能力突出\n'
            '• 中文优化：深度优化的中文理解\n'
            '• 视频理解：长视频内容分析\n\n'
            '**适用场景**：微信小程序 AI 助手、企业微信智能客服、腾讯云企业应用'
        ),
        'capabilities': [
            {'name': '多模态', 'level': 93, 'description': '图文视频统一理解'},
            {'name': '视频理解', 'level': 94, 'description': '长视频内容分析'},
            {'name': '中文优化', 'level': 95, 'description': '中文能力优秀'},
            {'name': '腾讯生态', 'level': 98, 'description': '深度集成腾讯产品'},
            {'name': '企业服务', 'level': 92, 'description': '腾讯云企业应用'},
            {'name': '内容安全', 'level': 93, 'description': '内容审核能力'},
        ],
        'useCases': [
            '微信小程序 AI', '企业微信助手', '腾讯云服务',
            '内容审核系统', '智能客服', '游戏 NPC AI',
        ],
        'pricing': {'input': '联系腾讯云', 'output': '联系腾讯云', 'context': '128K tokens'},
    },
}


def get_manual_override(model_id: str):
    """Get manually curated data for a model by its slug ID. Returns dict or None."""
    return MANUAL_MODELS.get(model_id)


def get_manual_detail(model_id: str):
    """Get manually curated detail for a model by its slug ID. Returns dict or None."""
    return MODEL_DETAILS.get(model_id)


def get_all_manual_ids():
    """Return all model IDs that have manual overrides."""
    return set(MANUAL_MODELS.keys())
