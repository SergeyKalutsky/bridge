import uuid
from fastapi import APIRouter, Depends
from .. import gitlab_api as gapi
from ..database import sess, t
from ..dependencies import get_token_header
from ..types import User

router = APIRouter(prefix="/users",
                   tags=['users'],
                   dependencies=[Depends(get_token_header)])


@router.post('/find')
async def find(user: User):
    q = sess.query(t.Users.id, t.Users.name).\
        filter(t.Users.name.contains(f'%{user.name}%')).all()
    return q
    

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
