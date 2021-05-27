import os
from git import Repo
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    bare_repo = Repo.init('bare-repo', bare=True)
    assert bare_repo.bare
    return {"message": "Hello World!"}

@app.get("/items/{item_id}")
async def read_item(item_id):
    return {"item_id": item_id}