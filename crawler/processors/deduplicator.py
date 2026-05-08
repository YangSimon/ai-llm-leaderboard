from typing import List, Dict
from collections import defaultdict
from ..models import RawModel
from ..utils.date_utils import to_model_id
from loguru import logger


def deduplicate_models(raw_models: List[RawModel]) -> List[RawModel]:
    """Merge models from multiple sources, using the best available data"""
    groups: Dict[str, List[RawModel]] = defaultdict(list)

    for m in raw_models:
        key = to_model_id(m.name)
        groups[key].append(m)

    merged = []
    for model_id, group in groups.items():
        if len(group) == 1:
            merged.append(group[0])
            continue

        # Merge: prefer LMSYS (has Elo), then OpenRouter (has context), then AA
        best = group[0]
        for m in group[1:]:
            # Company: prefer non-empty
            if not best.company and m.company:
                best.company = m.company
            # Elo: prefer any value
            if best.elo_score is None and m.elo_score is not None:
                best.elo_score = m.elo_score
            # Overall score: prefer any value
            if best.overall_score is None and m.overall_score is not None:
                best.overall_score = m.overall_score
            # Context length: prefer any value
            if (best.context_length is None or best.context_length == 0) and m.context_length:
                best.context_length = m.context_length
            # Source tracking
            if m.source not in (best.extra.get('sources', '')):
                sources = best.extra.get('sources', best.source)
                best.extra['sources'] = f"{sources},{m.source}" if sources else m.source

        merged.append(best)

    logger.info(f"Deduplication: {len(raw_models)} -> {len(merged)} models")
    return merged
