from loguru import logger
import sys

def setup_logger(debug: bool = False):
    """Configure loguru logger"""
    level = "DEBUG" if debug else "INFO"
    logger.remove()
    logger.add(sys.stderr, level=level, format="{time:YYYY-MM-DD HH:mm:ss} | {level:<7} | {message}")
    logger.info("Logger initialized")
