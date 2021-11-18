# to run use python -m uvicorn main:app --reload
# python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 <---- run on open port
from sql_app import sess, t
from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
import git_remote as gapi
from fastapi.middleware.cors import CORSMiddleware


class Creds(BaseModel):
    password: str
    login: str
    ssh_pub_key: Optional[str] = None
    name: Optional[str] = None


class Project(BaseModel):
    user_login: str
    type: Optional[int] = None
    repo: str
    description: Optional[str] = ''
    ssh_pub_key: Optional[str] = None


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def project_already_exists(repo):
    res = sess.query(t.Projects).filter(t.Projects.repo == repo).first()
    if res is None:
        return False
    return True


def add_project_record(project, isuserowner=True):
    sess.add(t.Projects(
        type=project.type,
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


@app.get('/projects/list/{user_login}')
async def list_projects(user_login: str):
    projects = gapi.get_user_projects(user_login)
    return {'projects': [{'id': p.id, 'name': p.name} for p in projects]}


@app.post('/projects/delete')
async def delete_project(project: Project):
    gapi.delete_user_project(project.user_login, project.repo)
    sess.query(t.Projects).filter(t.Projects.repo == project.repo).delete()


@app.post('/projects/create')
async def create_project(project: Project):
    if project_already_exists(project.repo):
        return 'Exists'
    add_project_record(project)
    gapi.create_project(project.user_login, project.repo, project.description)
    return {'res': 'created'}
