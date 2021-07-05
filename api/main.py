from pathlib import Path
from sql_app import sess, t
from git import Repo
from fastapi import FastAPI
from pydantic import BaseModel


class Creds(BaseModel):
    password: str
    login: str


class Data(BaseModel):
    user_id: int
    room_type: str
    repo: str
    

app = FastAPI()
git_dir = Path('/home/git')


@app.get('/')
async def home():
    return 'Home'


@app.post('/auth/')
async def auth(creds: Creds):
    # TODO: add hash security check
    user = sess.query(t.User).\
        filter(t.User.login == creds.login).\
        filter(t.User.password == creds.password).first()
    if user:
        return user
    return {'error': 'Неверный логин или пароль'}


@app.post('/rooms/create')
async def create_room(room: Room):
    pass

@app.get('/init-bare/{repo}')
async def init_bare(repo):
    bare_repo = Repo.init(git_dir / repo + '.git', bare=True)
    assert bare_repo.bare
    return {'message': 'works!'}

# TODO:
# 1. Write auth of a user
# 2. Write creation of a user.config.json
# 3. Write auth frontend
# 4. Write frontend for making a room
# 5. Write api handling room creation

# run on remote command
#  uvicorn main:app --host 0.0.0.0 --port 8000
# run git@64.225.27.238:/home/git/project.git

# uvicorn main:app --reload
# for development
