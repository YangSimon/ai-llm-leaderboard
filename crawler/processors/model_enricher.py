from typing import List
from ..models import RawModel, ProcessedModel
from ..config import COMPANY_LOGO, DEFAULT_LOGO, COMPANY_REGION
from ..utils.date_utils import to_model_id, now_iso
from loguru import logger


# Default tags by company
COMPANY_TAGS = {
    'OpenAI': ['代码生成', '数学推理', '多模态', '创意写作', '多语言'],
    'Anthropic': ['代码生成', '长文本分析', '创意写作', '安全对齐'],
    'Google': ['多模态', '长上下文', '多语言', '代码生成'],
    'Meta': ['开源模型', '代码生成', '多语言', '高效推理'],
    'DeepSeek': ['数学推理', '代码生成', '开源模型', '中文优化', '高效推理'],
    'Alibaba': ['中文优化', '多语言', '代码生成', '长上下文'],
    'Zhipu AI': ['数学推理', '代码生成', '多语言', '中文优化'],
    'Moonshot AI': ['长上下文', '中文优化', '多模态'],
    'Baichuan AI': ['中文优化', '多语言', '代码生成'],
}

# Description template
DESC_TEMPLATE = "{company} 开发的大语言模型，综合能力评分 {score}/100。{extra}"

# Region labels
REGION_LABELS = {
    'china': '中国模型',
    'non_china': '海外模型',
}


def enrich_model(raw: RawModel) -> ProcessedModel:
    """Enrich a raw model into a fully processed model"""
    model_id = to_model_id(raw.name)
    company = raw.company or 'Unknown'
    logo = COMPANY_LOGO.get(company, COMPANY_LOGO.get(company.split('/')[0].strip(), DEFAULT_LOGO))
    
    # Calculate overall score
    overall = raw.overall_score or 70.0
    if overall > 100:
        overall = round(overall / 10, 1)  # Normalize if out of range
    
    # Generate tags
    tags = list(COMPANY_TAGS.get(company, []))
    if raw.context_length and raw.context_length >= 100000:
        tags.append('长上下文')
    if raw.context_length and raw.context_length >= 200000:
        tags.insert(0, '超长上下文')
    
    # Clean tags (no duplicates, max 8)
    tags = list(dict.fromkeys(tags))[:8]
    if not tags:
        tags = ['大语言模型']

    # Generate description
    extra = ''
    if raw.elo_score:
        extra = f'Arena Elo 评分 {int(raw.elo_score)}。'
    if raw.context_length and raw.context_length >= 100000:
        extra += f' 支持上下文长度 {raw.context_length:,} tokens。'
    description = DESC_TEMPLATE.format(company=company, score=overall, extra=extra)

    return ProcessedModel(
        id=model_id,
        name=raw.name,
        company=company,
        logo=logo,
        overallScore=overall,
        reasoning=raw.reasoning or round(overall * 0.95, 0),
        coding=raw.coding or round(overall * 0.93, 0),
        math=raw.math or round(overall * 0.92, 0),
        multimodal=raw.multimodal or round(overall * 0.90, 0),
        creativeWriting=raw.creative_writing or round(overall * 0.88, 0),
        multilingual=raw.multilingual or round(overall * 0.91, 0),
        contextLength=raw.context_length or 128000,
        tags=tags,
        description=description,
        releaseDate='',
        dataSource=raw.source,
        eloScore=raw.elo_score,
        lastUpdated=now_iso(),
    )


def enrich_all(raw_models: List[RawModel]) -> List[ProcessedModel]:
    """Enrich all raw models"""
    processed = [enrich_model(m) for m in raw_models]
    logger.info(f"Enriched {len(processed)} models")
    return processed


def classify_models(models: List[ProcessedModel]) -> dict:
    """Classify models into global, non-china, and china lists"""
    global_models = []
    non_china = []
    china = []

    for m in models:
        region = COMPANY_REGION.get(m.company, COMPANY_REGION.get(m.company.split('/')[0].strip(), 'non_china'))
        global_models.append(m)
        if region == 'china':
            china.append(m)
        else:
            non_china.append(m)

    return {
        'global': sorted(global_models, key=lambda x: x.overallScore, reverse=True),
        'non_china': sorted(non_china, key=lambda x: x.overallScore, reverse=True),
        'china': sorted(china, key=lambda x: x.overallScore, reverse=True),
    }
