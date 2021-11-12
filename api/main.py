from pathlib import Path
from sql_app import sess, t
from git import Repo
from fastapi import FastAPI
from pydantic import BaseModel


class User(BaseModel):
    password: str
    login: str
    ssh_pub_key: str
    name: str


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


@app.post('/users/create')
async def create_user(creds: User):
    sess.add(t.User(
        login=creds.login,
        password=creds.password,
        name=creds.name,
        ssh_pub_key=creds.ssh_pub_key
    ))
    sess.commit()


@app.post('/users/auth')
async def auth(creds: User):
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
    return room


# Push
# Pull methods