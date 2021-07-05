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


def repo_already_exists(repo):
    res = sess.query(t.Rooms).filter(t.Rooms.repo == repo).first()
    if res is None:
        return True
    return False


def add_room_record(room, isuserowner=True):
    sess.add(t.Rooms(
        room_type=room.room_type,
        repo=room.repo,
        isuserowner=isuserowner,
        branch='master'
    ))
    sess.commit()


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
    # TODO: Add ssh key check
    if repo_already_exists(room.repo):
        return 'Exists'
    add_room_record(room)
    bare_repo = Repo.init(git_dir / (room.repo + '.git'), bare=True)
    assert bare_repo.bare
    return room
