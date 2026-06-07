from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
from app.api.v1.api import api_router

class Settings(BaseSettings):
    app_name: str = "KCIA API"
    version: str = "1.0.0"
    api_v1_str: str = "/api/v1"

    class Config:
        env_file = ".env"

settings = Settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    openapi_url=f"{settings.api_v1_str}/openapi.json"
)

app.include_router(api_router, prefix=settings.api_v1_str)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the KSP Crime Intelligence Assistant API"}

@app.get(f"{settings.api_v1_str}/health")
def health_check():
    return {"status": "healthy"}
