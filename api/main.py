# to run use python -m uvicorn main:app --reload
# python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 <---- run on open port
import uuid
from sqlalchemy.sql.expression import true

from sqlalchemy.sql.functions import user

from sql_app import sess, t
import git_remote as gapi
from typing import Optional, List
from pydantic import BaseModel
from fastapi import FastAPI, Header
from sqlalchemy.ext.declarative import api
from fastapi.middleware.cors import CORSMiddleware


class LoginCreds(BaseModel):
    password: str
    login: str
    name: Optional[str] = None


class Project(BaseModel):
    id: Optional[int]
    key: Optional[str]
    repo: Optional[str]
    type: Optional[int] = None
    description: Optional[str] = ''


class Member(BaseModel):
    id: int
    user_login: Optional[str] = ''
    project: Optional[Project] = None


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def auth(user_id, api_key):
    db_api_key = sess.query(t.Users.api_key).\
        filter(t.Users.id == user_id).first()[0]
    if db_api_key == api_key:
        return True
    return False


def project_already_exists(repo):
    res = sess.query(t.Projects).filter(t.Projects.repo == repo).first()
    if res is None:
        return False
    return True


def add_project_record(project, user_id):
    sess.add(t.Projects(
        id=project.id,
        type=project.type,
        repo=project.repo,
        key=project.key
    ))
    sess.add(t.Members(
        user_id=user_id,
        project_id=project.id,
        is_userowner=True
    ))
    sess.commit()


@app.post('/users/create')
async def create_user(creds: LoginCreds):
    sess.add(t.Users(
        login=creds.login,
        password=creds.password,
        name=creds.name,
        api_key=uuid.uuid4().hex
    ))
    sess.commit()


@app.post('/users/auth')
async def login_user(creds: LoginCreds):
    # TODO: add password hash security check
    user = sess.query(t.Users).\
        filter(t.Users.login == creds.login).\
        filter(t.Users.password == creds.password).first()
    if user:
        return user
    return {'error': 'Неверный логин или пароль'}


@app.post('/projects/list')
async def list_projects(api_key: str = Header(None),
                        user_id: str = Header(None)):
    if not auth(user_id, api_key):
        return 'Authentification failed'
    projects = gapi.gl.users.get(user_id).projects.list()
    return {'projects': [{'id': p.id, 'name': p.name} for p in projects]}


@app.post('/projects/delete')
async def delete_project(project: Project,
                         api_key: str = Header(None),
                         user_id: str = Header(None)):

    if not auth(user_id, api_key):
        return 'Authentification failed'
    gapi.gl.projects.delete(project.id)
    sess.query(t.Projects).\
        filter(t.Projects.id == project.id).delete()
    sess.query(t.Members).\
        filter(t.Members.project_id == project.id).delete()
    sess.commit()
    return {'res': 'deleted'}


@app.post('/projects/create')
async def create_project(project: Project,
                         api_key: str = Header(None),
                         user_id: str = Header(None)):
    if not auth(user_id, api_key):
        return 'Authentification failed'
    if project_already_exists(project.repo):
        return 'Exists'
    project.id = gapi.create_project(user_id, project)
    project.key = uuid.uuid4().hex
    add_project_record(project, user_id)
    return {'res': 'created', 'project': project}


@app.get('/projects/key/{repo}')
async def get_project_key(repo: str):
    res = sess.query(t.Projects.key).\
        filter(t.Projects.repo == repo).first()[0]
    return {'key': res}


@app.get('/projects/get/{key}')
async def get_project_by_key(key: str):
    res = sess.query(t.Projects.repo).\
        filter(t.Projects.key == key).first()[0]
    return {'repo': res}


@app.post('/projects/members/add')
async def add_member(m: Member):
    gapi.add_project_member(m.id, m.project.id)