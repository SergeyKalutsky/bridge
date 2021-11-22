#!python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import projects, users, members

app = FastAPI()
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(members.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
