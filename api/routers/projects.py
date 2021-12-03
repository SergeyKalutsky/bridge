import jwt
from api import gitlab_api as gapi
from fastapi import APIRouter, Header, Depends
from ..database import sess, t
from ..dependencies import verify_token
from ..types import Project
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter(prefix="/projects",
                   tags=['projects'],
                   dependencies=[Depends(verify_token)])


class ReturnProjects(BaseModel):
    id: int
    name: str
    isclassroom: int
    http: str

    class Config:
        orm_mode = True


def project_already_exists(name):
    res = sess.query(t.Projects).filter(t.Projects.name == name).first()
    if res is None:
        return False
    return True


def add_project_record(project, user_id, membership_accepted, access):
    sess.add(t.Projects(
        id=project.id,
        isclassroom=project.isclassroom,
        name=project.name,
    ))
    sess.add(t.Members(
        user_id=user_id,
        project_id=project.id,
        is_userowner=True,
        membership_accepted=membership_accepted,
        access=access
    ))
    sess.commit()


@router.get('/list', response_model=List[ReturnProjects])
async def list_projects(x_api_key: str = Header(None)):
    user_id = jwt.decode(x_api_key, 'SECRET_KEY', algorithms=['HS256'])['sub']
    projects = sess.query(t.Projects).\
        filter(t.Members.project_id == t.Projects.id).\
        filter(t.Members.user_id == user_id).all()
    return projects


@router.post('/create')
async def create_project(project: Project,
                         x_api_key: str = Header(None)):
    payload = jwt.decode(x_api_key, 'SECRET_KEY', algorithms=['HS256'])
    if project_already_exists(project.name):
        return 'Exists'
    if project.isclassroom:
        project.name += '_teacher'
    project.id = gapi.create_project(payload['sub'], project)
    add_project_record(project,
                       payload['sub'],
                       membership_accepted=True,
                       access='maintainer')
    return {'status': 'created', 'project': project}


@router.post('/delete')
async def delete_project(project: Project,
                         x_api_key: str = Header(None)):
    user_id = jwt.decode(x_api_key, 'SECRET_KEY', algorithms=['HS256'])['sub']
    is_userowner = sess.query(t.Members.is_userowner).\
        filter(t.Members.user_id == user_id).\
        filter(t.Members.project_id == project.id).first()[0]
    if is_userowner:
        gapi.gl.projects.delete(project.id)
        sess.query(t.Projects).\
            filter(t.Projects.id == project.id).delete()
        sess.query(t.Members).\
            filter(t.Members.project_id == project.id).delete()
        sess.commit()
        return {'stutus': 'sucesses', 'res': 'deleted'}
    return {'stutus': 'failed', 'error': 'user doesnt have rights to delete'}
