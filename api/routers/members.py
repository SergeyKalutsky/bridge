import jwt
from fastapi import APIRouter, Depends, Header
from .. import gitlab_api as gapi
from ..database import sess, t
from ..dependencies import verify_token
from ..types import Member

router = APIRouter(prefix="/members",
                   tags=['members'],
                   dependencies=[Depends(verify_token)])


@router.post('/add')
async def add_member(member: Member,
                     x_api_key: str = Header(None)):
    '''
    access levels: DEVELOPER_ACCESS read/write, 
                   GUEST_ACCESS view, 
                   REPORTER_ACCESS read
                   MAINTAINER_ACCESS read/write/delete
    '''
    user_id = jwt.decode(
        x_api_key, 'SECRET_KEY', algorithms=['HS256'])['sub']
    is_userowner = sess.query(t.Members.is_userowner).\
        filter(t.Members.user_id == user_id).\
        filter(t.Members.project_id == member.project_id).first()[0]
    if is_userowner:
        gapi.add_project_member(member)
        sess.add(t.Members(
            user_id=member.user_id,
            project_id=member.project_id,
            is_userowner=False,
            membership_accepted=False,
            access=member.access
        ))
        sess.commit()
        return {'status': 'success', 'res': 'user has been added'}
    return {'status': 'failed', 'error': 'you dont have rights to add memebers to that project'}


@router.post('/delete')
async def remove_member(member: Member,
                        x_api_key: str = Header(None)):
    '''Removes a member'''
    user_id = jwt.decode(
        x_api_key, 'SECRET_KEY', algorithms=['HS256'])['sub']
    is_userowner = sess.query(t.Members.is_userowner).\
        filter(t.Members.user_id == user_id).\
        filter(t.Members.project_id == member.project_id).first()[0]
    if is_userowner and member.user_id == user_id:
        return {'status': 'failed', 'error': 'cant remove yourself'}
    elif not is_userowner:
        return {'status': 'failed', 'error': 'you dont have rights to remove users'}
    else:
        gapi.remove_member(member)
        sess.query(t.Members).\
            filter(t.Members.project_id == member.project_id).\
            filter(t.Members.user_id == member.user_id).delete()
        sess.commit()
        return {'status': 'success', 'res': 'user has been removed'}


@router.post('/membership')
async def memberships(member: Member,
                      x_api_key: str = Header(None)):
    user_id = jwt.decode(
        x_api_key, 'SECRET_KEY', algorithms=['HS256'])['sub']
    sess.query(t.Members).\
        filter(t.Members.user_id == user_id).\
        filter(t.Members.project_id == member.project_id).\
        update({'membership_accepted': member.membership_accepted})
    sess.commit()
    return {'status': 'success', 'res': 'user accepted membership'}
