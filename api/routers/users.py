import jwt
from fastapi import APIRouter, Depends, Header
from .. import gitlab_api as gapi
from ..database import sess, t
from ..dependencies import verify_token
from ..types import User
from ..security import hashed_password
from typing import Optional, List
from pydantic import BaseModel


class ReturnUser(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


router = APIRouter(prefix="/users",
                   tags=['users'],
                   dependencies=[Depends(verify_token)])


@router.post('/find', response_model=List[ReturnUser])
async def find(user: User, x_api_key: str = Header(None)):
    user_id = jwt.decode(
        x_api_key, 'SECRET_KEY', algorithms=['HS256'])['sub']
    q = sess.query(t.Users).\
        filter(t.Users.name.contains(f'%{user.name}%')).\
        filter(t.Users.id != user_id).all()
    return q


@router.post('/create')
async def create_user(user: User):
    user_id = gapi.create_user(user)
    sess.add(t.Users(
        login=user.login,
        password=hashed_password(user.password),
        name=user.name,
        id=user_id
    ))
    sess.commit()
    return {'status': 'success'}
