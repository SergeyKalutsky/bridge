from api import gitlab_api as gapi
from fastapi import APIRouter, Depends
from .. import queries as q
from ..dependencies import verify_token, extract_user_id
from ..schemas import Project, ReturnProjects
from typing import List

router = APIRouter(prefix="/projects",
                   tags=['projects'],
                   dependencies=[Depends(verify_token)])


@router.get('/list', response_model=List[ReturnProjects])
async def list_projects(user_id=Depends(extract_user_id)):
    projects = q.list_projects_by_user_id(user_id)
    return projects


@router.post('/create')
async def create_project(project: Project,
                         user_id=Depends(extract_user_id)):
    if q.project_already_exists(project.name):
        return 'Exists'
    if project.isclassroom:
        project.name += '_teacher'
    project.id, project.http = gapi.create_project(user_id, project)
    q.add_new_project(project, user_id,
                      membership_accepted=True, access='maintainer')
    return {'status': 'created', 'project': project}


@router.post('/delete')
async def delete_project(project: Project, user_id=Depends(extract_user_id)):
    is_userowner = q.get_is_userowner(user_id, project.id)
    if is_userowner:
        gapi.gl.projects.delete(project.id)
        q.delete_project(project.id)
        return {'stutus': 'sucesses', 'res': 'deleted project'}
    q.delete_member(project.id, user_id)
    return {'stutus': 'sucesses', 'res': 'remooved member'}