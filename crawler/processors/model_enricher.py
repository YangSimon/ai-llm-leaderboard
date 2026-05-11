import hashlib
from typing import List
from ..models import RawModel, ProcessedModel
from ..config import COMPANY_LOGO, DEFAULT_LOGO, COMPANY_REGION
from ..utils.date_utils import to_model_id, now_iso
from ..manual_overrides import get_manual_override
from loguru import logger


# Company-specific dimension strength profiles.
# Values are bonus/penalty applied to the dimension score (vs overall baseline).
# These reflect each company's known research strengths and weaknesses.
COMPANY_PROFILES = {
    'Anthropic': {
        'coding': 3, 'reasoning': 2, 'creativeWriting': 1, 'math': 0,
        'multimodal': -2, 'multilingual': -1,
    },
    'Google': {
        'multimodal': 5, 'multilingual': 3, 'math': 2, 'reasoning': 1,
        'coding': 0, 'creativeWriting': -1,
    },
    'OpenAI': {
        'multimodal': 3, 'coding': 2, 'creativeWriting': 1, 'reasoning': 0,
        'math': 0, 'multilingual': 0,
    },
    'DeepSeek': {
        'math': 4, 'coding': 3, 'reasoning': 3, 'multilingual': 1,
        'multimodal': -4, 'creativeWriting': -2,
    },
    'Meta': {
        'multilingual': 2, 'coding': 1, 'reasoning': 0,
        'multimodal': -3, 'creativeWriting': 0, 'math': -1,
    },
    'xAI': {
        'reasoning': 3, 'coding': 2, 'creativeWriting': 1,
        'multilingual': -4, 'multimodal': -2, 'math': -1,
    },
    'Mistral AI': {
        'multilingual': 3, 'reasoning': 1, 'coding': 1,
        'multimodal': -3, 'creativeWriting': -1, 'math': -1,
    },
    'Cohere': {
        'multilingual': 3, 'reasoning': 0, 'coding': -1,
        'multimodal': -3, 'creativeWriting': -2, 'math': -2,
    },
    'Microsoft': {
        'coding': 2, 'reasoning': 1, 'math': 1,
        'multimodal': -2, 'creativeWriting': -1, 'multilingual': -1,
    },
    'Nvidia': {
        'coding': 2, 'math': 2, 'reasoning': 1,
        'multimodal': 0, 'creativeWriting': -2, 'multilingual': -1,
    },
    # Chinese companies
    'Alibaba': {
        'multilingual': 3, 'coding': 2, 'multimodal': 1, 'reasoning': 1,
        'math': 0, 'creativeWriting': 0,
    },
    'Zhipu AI': {
        'math': 3, 'reasoning': 3, 'coding': 2, 'multilingual': 1,
        'multimodal': -1, 'creativeWriting': 0,
    },
    'ByteDance': {
        'creativeWriting': 4, 'multimodal': 3, 'multilingual': 2,
        'reasoning': -1, 'coding': -1, 'math': -1,
    },
    'Moonshot AI': {
        'creativeWriting': 3, 'reasoning': 2, 'multimodal': 1,
        'coding': -2, 'math': -2, 'multilingual': 0,
    },
    'StepFun AI': {
        'coding': 3, 'math': 3, 'reasoning': 1,
        'multimodal': -2, 'creativeWriting': -2, 'multilingual': -1,
    },
    'Baichuan AI': {
        'multilingual': 2, 'multimodal': 1, 'creativeWriting': 1,
        'reasoning': 0, 'coding': -1, 'math': -1,
    },
    'MiniMax': {
        'creativeWriting': 2, 'reasoning': 1, 'multimodal': 1,
        'coding': -1, 'math': -1, 'multilingual': 0,
    },
    'Tencent': {
        'multimodal': 3, 'creativeWriting': 1, 'multilingual': 1,
        'reasoning': 0, 'coding': -1, 'math': 0,
    },
    'iFlytek': {
        'multimodal': 2, 'multilingual': 2, 'creativeWriting': 1,
        'coding': -2, 'math': -2, 'reasoning': 0,
    },
    'Shanghai AI Lab': {
        'reasoning': 2, 'coding': 1, 'math': 1,
        'multimodal': -1, 'creativeWriting': 0, 'multilingual': 0,
    },
    '01.AI': {
        'reasoning': 2, 'creativeWriting': 1, 'multilingual': 0,
        'coding': -1, 'math': 0, 'multimodal': -2,
    },
}

# Fallback company tags
COMPANY_TAGS = {
    'OpenAI': ['多模态', '代码生成', '创意写作', '多语言'],
    'Anthropic': ['代码生成', '长文本分析', '创意写作', '安全对齐'],
    'Google': ['多模态', '超长上下文', '多语言', '代码生成'],
    'Meta': ['开源', '代码生成', '多语言', '高效推理'],
    'DeepSeek': ['数学推理', '代码生成', '开源', '高性价比'],
    'Alibaba': ['中文优化', '多语言', '代码生成', '长文本优化'],
    'Zhipu AI': ['数学推理', '代码生成', '多语言', '中文优化'],
    'Moonshot AI': ['长文档分析', '中文优化', '多模态'],
    'Baichuan AI': ['中文优化', '多语言', '代码生成'],
    'ByteDance': ['对话流畅', '多模态', '创意写作'],
    'StepFun AI': ['代码生成', '数学推理', '开源'],
    'xAI': ['实时数据', '推理强', '风格开放'],
    'Mistral AI': ['开源', '多语言', '高效推理'],
    'Cohere': ['RAG优化', '多语言', '企业应用'],
    'Microsoft': ['轻量级', '高效', '推理'],
    'MiniMax': ['超长上下文', '高效推理'],
    'Tencent': ['多模态', '中文优化', '腾讯生态'],
    'iFlytek': ['中文优化', '多模态', '语音交互'],
    'Shanghai AI Lab': ['学术研究', '代码生成', '推理'],
    '01.AI': ['推理', '创意写作', '长上下文'],
    'Nvidia': ['代码生成', '数学推理', '高性能'],
}

DESC_TEMPLATE = "{company} 开发的大语言模型，综合能力评分 {score}/100。{extra}"


def _name_hash(name: str) -> int:
    """Generate a deterministic int hash from a model name (for variance)."""
    return int(hashlib.md5(name.encode()).hexdigest()[:4], 16)


def derive_dimension_scores(raw: RawModel, overall: float) -> dict:
    """
    Derive realistic per-dimension scores from the overall score.

    Strategy (in priority order):
    1. Use real scores from the data source if available.
    2. Apply company-specific profile + controlled deterministic variance.
    """
    company = raw.company or 'Unknown'
    profile = COMPANY_PROFILES.get(company, {})

    # Base coefficients: what each dimension "typically" scores relative to overall
    base_coeffs = {
        'reasoning': 0.96,
        'coding': 0.94,
        'math': 0.92,
        'multimodal': 0.89,
        'creativeWriting': 0.88,
        'multilingual': 0.91,
    }

    # Mapping from dimension key -> raw model attribute
    raw_attrs = {
        'reasoning': raw.reasoning,
        'coding': raw.coding,
        'math': raw.math,
        'multimodal': raw.multimodal,
        'creativeWriting': raw.creative_writing,
        'multilingual': raw.multilingual,
    }

    name_h = _name_hash(raw.name)
    dims = {}

    for idx, (dim, coeff) in enumerate(base_coeffs.items()):
        real_val = raw_attrs.get(dim)
        if real_val is not None:
            dims[dim] = max(0, min(100, int(round(real_val))))
            continue

        # Base estimate from overall score
        base = round(overall * coeff, 0)

        # Company-specific bonus/penalty
        bonus = profile.get(dim, 0)

        # Deterministic variance: ±2 points, different per dimension per model
        shift = ((name_h >> (idx * 3)) & 7) - 2
        variance = max(-2, min(2, shift))

        score = base + bonus + variance
        dims[dim] = max(0, min(100, int(score)))

    return dims


def generate_tags(raw: RawModel, company: str, manual: dict | None) -> list[str]:
    """Generate tags for a model, preferring manual overrides."""
    if manual and manual.get('tags'):
        return manual['tags']

    tags = list(COMPANY_TAGS.get(company, []))
    ctx = raw.context_length or 0
    if ctx >= 200000:
        tags.insert(0, '超长上下文')
    elif ctx >= 100000:
        tags.append('长上下文')

    tags = list(dict.fromkeys(tags))[:8]
    if not tags:
        tags = ['大语言模型']
    return tags


def generate_description(company: str, overall: float, raw: RawModel, manual: dict | None) -> str:
    """Generate a description, preferring manual overrides."""
    if manual and manual.get('description'):
        return manual['description']

    extra = ''
    if raw.elo_score:
        extra = f'Arena Elo 评分 {int(raw.elo_score)}。'
    if raw.context_length and raw.context_length >= 100000:
        extra += f' 支持上下文长度 {raw.context_length:,} tokens。'
    return DESC_TEMPLATE.format(company=company, score=overall, extra=extra)


def enrich_model(raw: RawModel) -> ProcessedModel:
    """Enrich a raw model into a fully processed model, with manual override support."""
    model_id = to_model_id(raw.name)
    company = raw.company or 'Unknown'
    manual = get_manual_override(model_id)

    # If we have a manual override, use its company/name (more accurate)
    if manual:
        company = manual.get('company', company)
        display_name = manual.get('name', raw.name)
    else:
        display_name = raw.name

    logo = COMPANY_LOGO.get(company, DEFAULT_LOGO)

    has_real_elo = raw.elo_score is not None
    has_real_overall = raw.overall_score is not None

    if manual and 'overallScore' in manual:
        overall = manual['overallScore']
        is_estimated = False
    elif has_real_overall:
        overall = raw.overall_score
        if overall > 100:
            overall = round(overall / 10, 1)
        is_estimated = not has_real_elo
    else:
        overall = 70.0
        is_estimated = True

    dims = derive_dimension_scores(raw, overall)
    if manual:
        for dim_key, model_attr in [
            ('reasoning', 'reasoning'), ('coding', 'coding'), ('math', 'math'),
            ('multimodal', 'multimodal'), ('creativeWriting', 'creativeWriting'),
            ('multilingual', 'multilingual'),
        ]:
            if model_attr in manual:
                dims[dim_key] = manual[model_attr]

    # Context length: manual > crawled > default
    if manual and 'contextLength' in manual:
        context_length = manual['contextLength']
    elif raw.context_length:
        context_length = raw.context_length
    else:
        context_length = 128000

    # Release date
    release_date = ''
    if manual and manual.get('releaseDate'):
        release_date = manual['releaseDate']

    tags = generate_tags(raw, company, manual)
    description = generate_description(company, overall, raw, manual)

    return ProcessedModel(
        id=model_id,
        name=display_name,
        company=company,
        logo=logo,
        overallScore=overall,
        reasoning=dims['reasoning'],
        coding=dims['coding'],
        math=dims['math'],
        multimodal=dims['multimodal'],
        creativeWriting=dims['creativeWriting'],
        multilingual=dims['multilingual'],
        contextLength=context_length,
        tags=tags,
        description=description,
        releaseDate=release_date,
        dataSource=raw.source,
        eloScore=raw.elo_score,
        lastUpdated=now_iso(),
        isEstimated=is_estimated,
    )


def enrich_all(raw_models: List[RawModel]) -> List[ProcessedModel]:
    """Enrich all raw models."""
    processed = [enrich_model(m) for m in raw_models]
    with_manual = sum(1 for m in raw_models if get_manual_override(to_model_id(m.name)))
    logger.info(
        f"Enriched {len(processed)} models ({with_manual} with manual overrides)"
    )
    return processed


def classify_models(models: List[ProcessedModel]) -> dict:
    """Classify models into global, non-china, and china lists, sorted by score."""
    non_china = []
    china = []

    for m in models:
        region = COMPANY_REGION.get(
            m.company, COMPANY_REGION.get(m.company.split('/')[0].strip(), 'non_china')
        )
        if region == 'china':
            china.append(m)
        else:
            non_china.append(m)

    global_sorted = sorted(models, key=lambda x: x.overallScore, reverse=True)
    non_china_sorted = sorted(non_china, key=lambda x: x.overallScore, reverse=True)
    china_sorted = sorted(china, key=lambda x: x.overallScore, reverse=True)

    return {
        'global': global_sorted,
        'non_china': non_china_sorted,
        'china': china_sorted,
    }
