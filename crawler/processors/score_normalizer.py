from ..models import RawModel, ProcessedModel
from ..config import ELO_MIN, ELO_MAX, COMPANY_LOGO, DEFAULT_LOGO
from ..utils.date_utils import to_model_id
from loguru import logger


def elo_to_score(elo: float) -> float:
    """Convert ELO rating to 0-100 score"""
    if elo is None:
        return 70.0  # Default mid-range score
    score = ((elo - ELO_MIN) / (ELO_MAX - ELO_MIN)) * 100
    return max(0, min(100, round(score, 1)))


def normalize_model(raw: RawModel) -> RawModel:
    """Normalize scores for a single raw model"""
    if raw.overall_score is None and raw.elo_score is not None:
        raw.overall_score = elo_to_score(raw.elo_score)
    if raw.overall_score is not None:
        raw.overall_score = max(0, min(100, raw.overall_score))
    return raw


def normalize_all(raw_models: list) -> list:
    """Normalize scores for all raw models"""
    return [normalize_model(m) for m in raw_models]
