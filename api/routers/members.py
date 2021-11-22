from fastapi import APIRouter, Depends, Header
from .. import gitlab_api as gapi
from ..database import sess, t
from ..dependencies import get_token_header
from ..types import Project

router = APIRouter(prefix="/members",
                   tags=['members'],
                   dependencies=[Depends(get_token_header)])


@router.post('/add')
async def add_member(project: Project,
                     permission: str,
                     user_id: str = Header(None)):
    '''
    access levels: DEVELOPER_ACCESS read/write, 
                   GUEST_ACCESS view, 
                   REPORTER_ACCESS read
                   MAINTAINER_ACCESS read/write/delete
    '''
    gapi.add_project_member(user_id, project.id, permission)
    sess.add(t.Members(
        user_id=user_id,
        project_id=project.id,
        is_userowner=False
    ))
    sess.commit()


@router.post('/remove')
async def remove_member(project: Project, user_remove_id: int):
    '''Removes a member'''
    remove_member(project, user_remove_id)
