from fastapi import APIRouter, Depends
from .. import gitlab_api as gapi
from ..database import sess, t
from ..dependencies import verify_token
from ..types import User
from ..security import hashed_password
from typing import Optional
from pydantic import BaseModel

class ReturnUser(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

router = APIRouter(prefix="/users",
                   tags=['users'],
                   dependencies=[Depends(verify_token)])


@router.post('/find', response_model=ReturnUser)
async def find(user: User):
    q = sess.query(t.Users).\
        filter(t.Users.name.contains(f'%{user.name}%')).first()
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

