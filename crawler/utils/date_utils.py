from datetime import datetime, timezone, timedelta
import re

def now_iso() -> str:
    """Get current UTC time in ISO format"""
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

def today_str() -> str:
    """Get today's date as YYYY-MM-DD"""
    return datetime.now(timezone.utc).strftime('%Y-%m-%d')

def days_ago(days: int) -> str:
    """Get date N days ago as YYYY-MM-DD"""
    return (datetime.now(timezone.utc) - timedelta(days=days)).strftime('%Y-%m-%d')

def parse_date(date_str: str) -> datetime:
    """Parse various date formats, always returning timezone-aware UTC datetime"""
    if not date_str:
        return datetime.now(timezone.utc)

    for fmt in [
        '%Y-%m-%dT%H:%M:%S%z',
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y-%m-%d %H:%M:%S',
        '%Y-%m-%d',
        '%a, %d %b %Y %H:%M:%S %z',
        '%a, %d %b %Y %H:%M:%S GMT',
    ]:
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    return datetime.now(timezone.utc)

def is_within_days(date_str: str, days: int) -> bool:
    """Check if a date string is within N days from now"""
    try:
        dt = parse_date(date_str)
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        return dt > cutoff
    except Exception:
        return True

def to_model_id(name: str) -> str:
    """Convert model name to ID (lowercase, hyphens)"""
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-')
