# to run use python -m uvicorn main:app --reload
# python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 <---- run on open port
#!python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import projects, users

app = FastAPI()
app.include_router(users.router)
app.include_router(projects.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
