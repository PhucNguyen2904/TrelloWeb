from pydantic_settings import BaseSettings
from typing import Literal
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Get the app directory
APP_DIR = Path(__file__).parent.parent

# Load environment file
env_file = os.getenv("ENV_FILE", "staging")
env_path = APP_DIR / f".env.{env_file}"

if env_path.exists():
    load_dotenv(env_path)
else:
    # Fallback to .env.staging if no env file specified
    load_dotenv(APP_DIR / ".env.staging")


class Settings(BaseSettings):
    """Application settings"""
    
    # App
    APP_NAME: str = "Trello Clone API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    # SQLite fallback: sqlite:///./test.db
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost,http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"
    
    class Config:
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse ALLOWED_ORIGINS if it's a string (from env variable)
        if isinstance(self.ALLOWED_ORIGINS, str):
            try:
                self.ALLOWED_ORIGINS = json.loads(self.ALLOWED_ORIGINS)
            except json.JSONDecodeError:
                # If it fails, split by comma
                self.ALLOWED_ORIGINS = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()
