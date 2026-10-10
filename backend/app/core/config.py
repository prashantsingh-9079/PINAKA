"""
PINAKA Backend Configuration
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "PINAKA"

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # Gemma Flash Settings (for text processing tasks)
    GEMMA_MODEL_NAME: str = "google/gemma-2-2b-it"  # or gemma-7b
    GEMMA_API_KEY: Optional[str] = None
    GEMMA_MAX_LENGTH: int = 512
    GEMMA_TEMPERATURE: float = 0.7

    # Database (if needed)
    DATABASE_URL: Optional[str] = None

    # Redis (for caching/queues)
    REDIS_URL: str = "redis://localhost:6379"

    # File storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB

    # Ingestion settings
    INGESTION_BUFFER_SIZE: int = 1000
    INGESTION_WORKERS: int = 4

    # Tracking settings
    MAX_TRACKING_OBJECTS: int = 100
    TRACKING_IOU_THRESHOLD: float = 0.5

    # Event detection
    EVENT_CONFIDENCE_THRESHOLD: float = 0.7
    EVENT_MIN_DURATION: float = 1.0  # seconds

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()