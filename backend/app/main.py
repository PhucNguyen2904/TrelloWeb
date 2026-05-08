from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base
from app.db.session import engine
from app.api.router import router
from app.core.config import settings

from contextlib import asynccontextmanager
from app.core.middleware import SecurityHeadersMiddleware, SanitizationMiddleware
from app.infrastructure.cache import cache_service

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Redis
    await cache_service.connect()
    yield
    # Shutdown: Disconnect from Redis
    await cache_service.disconnect()

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="A Trello-like task management API built with FastAPI",
    lifespan=lifespan
)

print(f"CORS: Allowed origins: {settings.ALLOWED_ORIGINS}")


# Layer 3 & 4: Security and Sanitization Middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(SanitizationMiddleware)



# Add CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include router
app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )