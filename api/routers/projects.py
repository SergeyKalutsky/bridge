import uuid
from api import gitlab_api as gapi
from fastapi import APIRouter, Header, Depends
from ..database import sess, t
from ..dependencies import verify_token
from ..types import Project


router = APIRouter(prefix="/projects",
                   tags=['projects'],
                   dependencies=[Depends(verify_token)])


def project_already_exists(name):
    res = sess.query(t.Projects).filter(t.Projects.name == name).first()
    if res is None:
        return False
    return True


def add_project_record(project, user_id, submodule_for=None):
    sess.add(t.Projects(
        id=project.id,
        isclassroom=project.isclassroom,
        name=project.name,
        key=project.key,
        submodule_for=submodule_for
    ))
    sess.add(t.Members(
        user_id=user_id,
        project_id=project.id,
        is_userowner=True
    ))
    sess.commit()


@router.post('/list')
async def list_projects(user_id: str = Header(None)):
    projects = sess.query(t.Projects.id,
                          t.Projects.name,
                          t.Projects.isclassroom).\
        filter(t.Members.project_id == t.Projects.id).\
        filter(t.Members.user_id == user_id).all()
    return {'projects': [{'id': p.id, 'name': p.name, 'isclassroom': p.isclassroom} for p in projects]}


@router.post('/delete')
async def delete_project(project: Project,
                         user_id: str = Header(None)):
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
    else:
        gapi.remove_member(user_id, project.id)
        sess.query(t.Members).\
            filter(t.Members.project_id == project.id).\
            filter(t.Members.user_id == user_id).delete()
        sess.commit()
    return {'res': 'deleted'}


@router.post('/create')
async def create_project(project: Project,
                         user_id: str = Header(None)):
    if project_already_exists(project.name):
        return 'Exists'
    if project.isclassroom:
        project.id = gapi.create_project(user_id, project)
        project.key = uuid.uuid4().hex
        add_project_record(project, user_id)
        project.name += '_teacher'
        project.id = gapi.create_project(
            user_id, project, submodule_for=project.id)
        project.key = uuid.uuid4().hex
        add_project_record(project, user_id)
    else:
        project.id = gapi.create_project(user_id, project)
        project.key = uuid.uuid4().hex
        add_project_record(project, user_id)
    return {'res': 'created', 'project': project}


@router.get('/key/{name}')
async def get_project_key(name: str):
    res = sess.query(t.Projects.key).\
        filter(t.Projects.name == name).first()[0]
    return {'key': res}


@router.get('/get/{key}')
async def get_project_by_key(key: str):
    project = sess.query(t.Projects).\
        filter(t.Projects.key == key).first()
    return project

