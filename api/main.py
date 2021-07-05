from pathlib import Path
from sql_app import sess, t
from git import Repo
from fastapi import FastAPI
from pydantic import BaseModel


class Creds(BaseModel):
    password: str
    login: str


class Room(BaseModel):
    user_id: int
    room_type: int
    repo: str
    ssh_pub_key: str


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
    path = str(git_dir / (room.repo + '.git'))
    sess.add(t.Rooms(
        room_type=room.room_type,
        repo=path,
        isuserowner=True,
        branch='master'
    ))
    sess.commit()
    bare_repo = Repo.init(path, bare=True)
    assert bare_repo.bare
    return room


@app.get('/init-bare/{repo}')
async def init_bare(repo):
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
