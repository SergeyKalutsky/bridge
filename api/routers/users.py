import uuid
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from .. import gitlab_api as gapi
from ..database import sess, t
from ..dependencies import get_token_header

router = APIRouter(prefix="/users",
                   tags=['users'],
                   dependencies=[Depends(get_token_header)])


class User(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    login: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None


@router.post('/find')
async def find():
    pass


@router.post('/create')
async def create_user(user: User):
    gapi.create_user(user)
    sess.add(t.Users(
        login=user.login,
        password=user.password,
        name=user.name,
        api_key=uuid.uuid4().hex
    ))
    sess.commit()


@router.post('/users')
async def login_user(user: User, tags=['users']):
    # TODO: add password hash security check
    user = sess.query(t.Users).\
        filter(t.Users.login == user.login).\
        filter(t.Users.password == user.password).first()
    if user:
        return user
    return {'error': 'Неверный логин или пароль'}


@router.post('/auth')
async def login_user(user: User):
    # TODO: add password hash security check
    user = sess.query(t.Users).\
        filter(t.Users.login == user.login).\
        filter(t.Users.password == user.password).first()
    if user:
        return user
    return {'error': 'Неверный логин или пароль'}
