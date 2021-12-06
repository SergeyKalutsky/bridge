from fastapi import APIRouter, Depends
from .. import gitlab_api as gapi
from .. import queries as q
from ..dependencies import extract_user_id, verify_token
from ..schemas import Member, ReturnMember
from typing import List

router = APIRouter(prefix="/members",
                   tags=['members'],
                   dependencies=[Depends(verify_token)])


@router.post('/add')
async def add_member(member: Member,
                     user_id=Depends(extract_user_id)):
    '''
    access levels: DEVELOPER_ACCESS read/write, 
                   GUEST_ACCESS view, 
                   REPORTER_ACCESS read
                   MAINTAINER_ACCESS read/write/delete
    '''
    is_userowner = q.get_is_userowner(user_id, member.project_id)
    is_classroom = q.get_is_classroom(member.project_id)
    if is_userowner and not is_classroom:
        gapi.add_project_member(member, 'developer')
        q.add_project_member(member.user_id,
                             member.project_id,
                             is_userowner=False,
                             membership_accepted=False,
                             access='developer')
        return {'status': 'success', 'res': 'user has been added'}
    return {'status': 'failed', 'error': 'you dont have rights to add memebers to that project'}


@router.get('/list', response_model=List[ReturnMember])
async def list_members(project_id: int,
                       user_id=Depends(extract_user_id)):
    '''Lists members of a particular project yourself excluded'''
    is_userowner = q.get_is_userowner(user_id, project_id)
    if is_userowner:
        return q.list_project_members(project_id)


@router.post('/delete')
async def remove_member(member: Member,
                        user_id=Depends(extract_user_id)):
    '''Removes a member'''
    is_userowner = q.get_is_userowner(user_id, member.project_id)
    if is_userowner and member.user_id == user_id:
        return {'status': 'failed', 'error': 'cant remove yourself'}
    elif not is_userowner:
        return {'status': 'failed', 'error': 'you dont have rights to remove users'}
    else:
        gapi.remove_member(member)
        q.delete_member(member.project_id, member.user_id)
        return {'status': 'success', 'res': 'user has been removed'}


@router.post('/membership')
async def memberships(member: Member,
                      user_id=Depends(extract_user_id)):
    q.change_membership_status(user_id, member)
    return {'status': 'success', 'res': 'membeship status changed'}
