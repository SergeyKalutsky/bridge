import jwt
from fastapi import APIRouter, Depends, Header
from .. import gitlab_api as gapi
from ..queries import find_user_by_name, add_new_user
from ..dependencies import verify_token
from ..schemas import User, ReturnUser
from typing import List

router = APIRouter(prefix="/users",
                   tags=['users'],
                   dependencies=[Depends(verify_token)])


@router.post('/find', response_model=List[ReturnUser])
async def find(user: User, x_api_key: str = Header(None)):
    user_id = jwt.decode(
        x_api_key, 'SECRET_KEY', algorithms=['HS256'])['sub']
    res = find_user_by_name(user.name, user_id)
    return res


@router.post('/create')
async def create_user(user: User):
    user.id = gapi.create_user(user)
    add_new_user(user)
    return {'status': 'success'}
