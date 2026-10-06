"""Structured application logging configuration for QUANTEX."""

import logging
import sys


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Configure root and application loggers with structured formatting."""
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)

    log_format = (
        "%(asctime)s [%(levelname)s] [%(name)s] "
        "[%(filename)s:%(lineno)d] - %(message)s"
    )

    logging.basicConfig(
        level=numeric_level,
        format=log_format,
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    logger = logging.getLogger("quantex")
    logger.setLevel(numeric_level)
    return logger
