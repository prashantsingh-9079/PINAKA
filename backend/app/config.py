import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PINAKA"
    PROJECT_FULL_NAME: str = "Multi-Sensor AI for Drone Detection, Tracking & Swarm Analytics"
    VERSION: str = "2.4.0"
    API_PREFIX: str = "/api"
    
    # Database
    DATABASE_URL: str = "sqlite:///./pinaka.db"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5645",
        "http://127.0.0.1:5645",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Simulation
    DEFAULT_SCENARIO: str = "default"
    SIMULATION_TICK_RATE_HZ: int = 10  # 100ms ticks
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
