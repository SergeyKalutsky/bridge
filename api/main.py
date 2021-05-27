from pathlib import Path
from git import Repo
from fastapi import FastAPI

app = FastAPI()
git_dir = Path('/home/git')


@app.get("/")
async def home():
    return {'messge': 'hi there'}


@app.get("/init-bare/{repo}")
async def init_bare(repo):
    bare_repo = Repo.init(git_dir / repo, bare=True)
    assert bare_repo.bare
    return {"message": 'works!'}
