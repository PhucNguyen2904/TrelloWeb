from pydantic_settings import BaseSettings
from typing import Literal, Any
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Get the app directory
APP_DIR = Path(__file__).parent.parent

# Load environment file
env_file = os.getenv("ENV_FILE")
if env_file:
    env_path = APP_DIR / f".env.{env_file}"
else:
    # Try .env.local first, then fallback to .env.staging
    env_path = APP_DIR / ".env.local"
    if not env_path.exists():
        env_path = APP_DIR / ".env.staging"

if env_path.exists():
    print(f"DEBUG: Loading env from {env_path}")
    load_dotenv(env_path, override=True)
else:
    print(f"DEBUG: Env file NOT FOUND at {env_path}")



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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # Layer 2: 15 minutes
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7    # Layer 2: 7 days
    
    # Redis (Layer 2)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str | None = None
    
    # Upstash Redis
    UPSTASH_REDIS_REST_URL: str | None = None
    UPSTASH_REDIS_REST_TOKEN: str | None = None
    
    # CORS
    ALLOWED_ORIGINS: Any = [
        # Local development
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        # Vercel production & preview deployments
        "https://trello-web-neon-rho.vercel.app",
        "https://trello-web-phi-five.vercel.app",
        "https://trello-web-git-master-team-alpla.vercel.app",
        "https://trelloweb-phucnguyen2904.vercel.app",
    ]
    
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
                self.ALLOWED_ORIGINS = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        # Ensure it's always a list
        if not isinstance(self.ALLOWED_ORIGINS, list):
            self.ALLOWED_ORIGINS = [self.ALLOWED_ORIGINS]


settings = Settings()
print(f"DEBUG: UPSTASH_REDIS_REST_URL: {settings.UPSTASH_REDIS_REST_URL}")
