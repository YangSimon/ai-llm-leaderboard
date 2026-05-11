import re
from difflib import SequenceMatcher
from typing import List, Dict, Tuple
from collections import defaultdict
from ..models import RawModel
from ..utils.date_utils import to_model_id
from loguru import logger

# Threshold for fuzzy name matching (0.0 - 1.0). Higher = stricter.
FUZZY_THRESHOLD = 0.88

# Common name normalizations applied before slug generation.
# Maps messy source names to canonical forms.
NAME_NORMALIZATIONS = [
    # Version format variations
    (r'\b(\d+)\.(\d+)\b', r'\1-\2'),          # "3.5" -> "3-5"
    (r'\bGPT\s*(\d)', r'GPT-\1'),              # "GPT 4" -> "GPT-4"
    (r'\bClaude\s*(\d)', r'Claude-\1'),        # "Claude 3" -> "Claude-3"
    # Remove parenthetical versions
    (r'\s*\([^)]*\)\s*', ' '),
    # Normalize whitespace
    (r'\s+', ' '),
]

# Known equivalent name patterns that should map to the same model.
# Format: canonical form -> list of variations that mean the same model.
MODEL_ALIASES = {
    'gpt-4o': ['gpt4o', 'gpt-4-omni', 'gpt-4o-2024-05-13'],
    'gpt-4-turbo': ['gpt4-turbo', 'gpt-4-1106-preview', 'gpt-4-0125-preview'],
    'gpt-4o-mini': ['gpt4o-mini', 'gpt-4o-mini-2024-07-18'],
    'claude-3-5-sonnet': ['claude-3-5-sonnet-20240620', 'claude-sonnet-3.5'],
    'claude-3-opus': ['claude-3-opus-20240229'],
    'claude-4-sonnet': ['claude-sonnet-4', 'claude-4-sonnet-20250514'],
    'claude-4-7-opus': ['claude-opus-4-7', 'claude-4.7-opus'],
    'gemini-1-5-pro': ['gemini-1.5-pro', 'gemini-1-5-pro-001'],
    'gemini-2-ultra': ['gemini-2-0-ultra', 'gemini-2.0-ultra'],
    'gemini-3-1-ultra': ['gemini-3.1-ultra', 'gemini-3-1-ultra-pro'],
    'llama-3-405b': ['llama-3-405b-instruct', 'llama3-405b'],
    'llama-3-70b': ['llama-3-70b-instruct', 'llama3-70b'],
    'llama-3-8b': ['llama-3-8b-instruct', 'llama3-8b'],
    'mixtral-8x22b': ['mixtral-8x22b-instruct'],
    'mistral-large': ['mistral-large-2', 'mistral-large-latest'],
    'mistral-nemo': ['mistral-nemo-2407', 'open-mistral-nemo'],
    'deepseek-v3': ['deepseek-v3-0324'],
    'deepseek-r1': ['deepseek-r1-0528'],
    'deepseek-v4': ['deepseek-v4-0506'],
    'qwen2-5-72b': ['qwen2.5-72b', 'qwen-2.5-72b-instruct'],
    'qwen3-72b': ['qwen3-72b-instruct'],
    'qwen4-72b': ['qwen4-72b-instruct'],
    'grok-4-2': ['grok-4.2', 'grok-4-2-1212'],
    'gemma-2-27b': ['gemma-2-27b-it'],
    'phi-3-medium': ['phi-3-medium-4k-instruct', 'phi-3-medium-128k-instruct'],
    'phi-3-small': ['phi-3-small-8k-instruct', 'phi-3-small-128k-instruct'],
    'command-r-plus': ['command-r-plus-08-2024'],
    'yi-large': ['yi-large-preview'],
    'yi-lightning': ['yi-lightning-lite'],
    'glm-4-plus': ['glm-4-plus-0111'],
    'glm-4-5': ['glm-4.5'],
    'minimax-01': ['minimax-01-series'],
    'doubao-4-0': ['doubao-4.0', 'doubao-4-0-pro'],
    'kimi-2-5': ['kimi-2.5'],
    'step-3-5': ['step-3.5'],
    'hunyuan-pro': ['hunyuan-pro-2024'],
    'spark-ultra': ['spark-ultra-2024'],
}


def normalize_name(name: str) -> str:
    """Normalize a model name before comparison: version formats, whitespace, etc."""
    s = name.strip().lower()
    for pattern, replacement in NAME_NORMALIZATIONS:
        s = re.sub(pattern, replacement, s)
    return s.strip()


def resolve_alias(name: str) -> str:
    """If a name matches a known alias, return the canonical form."""
    slug = to_model_id(name)
    if slug in MODEL_ALIASES:
        return slug
    for canonical, aliases in MODEL_ALIASES.items():
        if slug in aliases:
            return canonical
        # Also check normalized names
        for alias in aliases:
            if to_model_id(alias) == slug:
                return canonical
    return slug


def is_fuzzy_match(name_a: str, name_b: str, threshold: float = FUZZY_THRESHOLD) -> bool:
    """Check if two model names are likely the same model via fuzzy matching."""
    a = normalize_name(name_a)
    b = normalize_name(name_b)
    if a == b:
        return True
    # Substring match with length ratio check to avoid "gpt-4" matching "gpt-4o-mini"
    if a in b or b in a:
        shorter = min(len(a), len(b))
        longer = max(len(a), len(b))
        if shorter >= longer * 0.7:
            return True
    ratio = SequenceMatcher(None, a, b).ratio()
    return ratio >= threshold


def _merge_group(group: List[RawModel]) -> RawModel:
    """Merge a group of RawModels representing the same model from different sources."""
    if len(group) == 1:
        return group[0]

    best = group[0]
    for m in group[1:]:
        if not best.company and m.company:
            best.company = m.company
        if best.elo_score is None and m.elo_score is not None:
            best.elo_score = m.elo_score
        if best.overall_score is None and m.overall_score is not None:
            best.overall_score = m.overall_score
        if (best.context_length is None or best.context_length == 0) and m.context_length:
            best.context_length = m.context_length
        # Merge extra dimension scores
        for dim in ['reasoning', 'coding', 'math', 'multimodal', 'creative_writing', 'multilingual']:
            if getattr(best, dim, None) is None and getattr(m, dim, None) is not None:
                setattr(best, dim, getattr(m, dim))
        # Track sources
        existing_sources = best.extra.get('sources', best.source)
        if m.source not in existing_sources:
            best.extra['sources'] = f"{existing_sources},{m.source}"

    return best


def deduplicate_models(raw_models: List[RawModel]) -> List[RawModel]:
    """
    Multi-pass deduplication of models from multiple sources.

    Pass 1: Exact slug matching (fast, catches most duplicates).
    Pass 2: Alias resolution (known name variations).
    Pass 3: Fuzzy name matching (catches remaining duplicates with high threshold).
    """
    if not raw_models:
        return []

    # --- Pass 1: Exact slug matching ---
    exact_groups: Dict[str, List[RawModel]] = defaultdict(list)
    for m in raw_models:
        slug = to_model_id(m.name)
        exact_groups[slug].append(m)

    logger.debug(f"Pass 1 (exact slug): {len(raw_models)} -> {len(exact_groups)} groups")

    # --- Pass 2: Alias resolution ---
    alias_groups: Dict[str, List[RawModel]] = defaultdict(list)
    for slug, group in exact_groups.items():
        canonical = resolve_alias(slug)
        alias_groups[canonical].extend(group)

    if len(alias_groups) < len(exact_groups):
        logger.debug(
            f"Pass 2 (alias): {len(exact_groups)} -> {len(alias_groups)} groups "
            f"(resolved {len(exact_groups) - len(alias_groups)} aliases)"
        )

    # --- Pass 3: Fuzzy matching across groups ---
    # Collect representative names for each group
    group_entries: List[Tuple[str, List[RawModel]]] = list(alias_groups.items())
    merged_indices: set[int] = set()
    final_groups: List[List[RawModel]] = []

    for i in range(len(group_entries)):
        if i in merged_indices:
            continue
        base_slug, base_models = group_entries[i]
        combined = list(base_models)

        for j in range(i + 1, len(group_entries)):
            if j in merged_indices:
                continue
            other_slug, other_models = group_entries[j]

            # Try fuzzy match on slug
            if is_fuzzy_match(base_slug, other_slug):
                combined.extend(other_models)
                merged_indices.add(j)
                continue

            # Try fuzzy match on original names
            base_names = [m.name for m in combined]
            other_names = [m.name for m in other_models]
            matched = False
            for bn in base_names:
                for on in other_names:
                    if is_fuzzy_match(bn, on):
                        matched = True
                        break
                if matched:
                    break
            if matched:
                combined.extend(other_models)
                merged_indices.add(j)

        final_groups.append(combined)

    fuzzy_merges = len(alias_groups) - len(final_groups)
    merged = [_merge_group(g) for g in final_groups]

    logger.info(
        f"Deduplication: {len(raw_models)} raw -> {len(exact_groups)} exact groups "
        f"-> {len(alias_groups)} alias-resolved -> {len(merged)} final "
        f"(fuzzy merges: {fuzzy_merges})"
    )
    return merged
