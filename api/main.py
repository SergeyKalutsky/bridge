# to run use python -m uvicorn main:app --reload
from sql_app import sess, t
from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
import git_remote as gapi

class Creds(BaseModel):
    password: str
    login: str
    ssh_pub_key: Optional[str] = None
    name: Optional[str] = None


class Project(BaseModel):
    user_id: int
    room_type: int
    repo: str
    ssh_pub_key: str


app = FastAPI()

def project_already_exists(repo):
    res = sess.query(t.Projects).filter(t.Projects.repo == repo).first()
    if res is None:
        return True
    return False


def add_project_record(project, isuserowner=True):
    sess.add(t.Project(
        room_type=project.type,
        repo=project.repo,
        isuserowner=isuserowner,
        branch='master'
    ))
    sess.commit()


@app.get('/')
async def home():
    return 'Home'


@app.post('/users/create')
async def create_user(creds: Creds):
    sess.add(t.User(
        login=creds.login,
        password=creds.password,
        name=creds.name,
        ssh_pub_key=creds.ssh_pub_key
    ))
    sess.commit()


@app.post('/users/auth')
async def auth(creds: Creds):
    # TODO: add hash security check
    print(creds)
    user = sess.query(t.User).\
        filter(t.User.login == creds.login).\
        filter(t.User.password == creds.password).first()
    if user:
        return user
    return {'error': 'Неверный логин или пароль'}


@app.post('/projects/create')
async def create_room(project: Project):
    # TODO: Add ssh key check
    if project_already_exists(project.repo):
        return 'Exists'
    add_project_record(project)
    
    return room


# Push
# Pull methods