import uuid
from fastapi import APIRouter, Depends
from .. import gitlab_api as gapi
from ..database import sess, t
from ..dependencies import verify_token
from ..types import User
from ..security import hashed_password, check_password, encode_auth_token


router = APIRouter(prefix="/users",
                   tags=['users'],
                   dependencies=[Depends(verify_token)])


@router.post('/find')
async def find(user: User):
    q = sess.query(t.Users.id, t.Users.name).\
        filter(t.Users.name.contains(f'%{user.name}%')).all()
    return q


@router.post('/create')
async def create_user(user: User):
    user_id = gapi.create_user(user)
    sess.add(t.Users(
        login=user.login,
        password=hashed_password(user.password),
        name=user.name,
        user_id=user_id
    ))
    sess.commit()
    return {'status': 'success'}

