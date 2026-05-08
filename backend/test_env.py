import os
from pathlib import Path
from dotenv import load_dotenv

APP_DIR = Path(__file__).parent / "app"
env_path = APP_DIR / ".env.local"

print(f"Checking path: {env_path}")
print(f"Exists: {env_path.exists()}")

if env_path.exists():
    load_dotenv(env_path)
    print(f"UPSTASH_REDIS_REST_URL: {os.getenv('UPSTASH_REDIS_REST_URL')}")
    print(f"UPSTASH_REDIS_REST_TOKEN: {os.getenv('UPSTASH_REDIS_REST_TOKEN')}")
else:
    print("File not found")
