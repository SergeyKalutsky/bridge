from pathlib import Path
from git import Repo
from fastapi import FastAPI


app = FastAPI()
git_dir = Path('/home/git')


@app.get("/")
async def home():
    return {'messge': 'hi there'}


@app.get("/auth/{login}-{password}")
async def auth(login, password):
    return {'login': login, 'passwd':password}



@app.get("/init-bare/{repo}")
async def init_bare(repo):
    bare_repo = Repo.init(git_dir / repo + '.git', bare=True)
    assert bare_repo.bare
    return {"message": 'works!'}

# TODO:
# 1. Write auth of a user
# 2. Write creation of a user.config.json
# 3. Write auth frontend
# 4. Write frontend for making a room

# run on remote command
#  uvicorn main:app --host 0.0.0.0 --port 8000
# run git@64.225.27.238:/home/git/project.git