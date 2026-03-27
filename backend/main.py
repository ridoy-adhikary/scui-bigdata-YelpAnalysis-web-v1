import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db_pool, close_db_pool
from routes.ai import router as ai_router
from routes.data import router as data_router

load_dotenv()

app = FastAPI(title="Yelp Text-to-SQL Backend")

cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000")
cors_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db_pool()


@app.on_event("shutdown")
def shutdown_event():
    close_db_pool()


@app.get("/api/health")
def health():
    return {"status": "ok"}


app.include_router(ai_router)
app.include_router(data_router)
