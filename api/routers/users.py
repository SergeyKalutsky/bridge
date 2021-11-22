import uuid
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from ..database import sess, t
from ..dependencies import get_token_header

router = APIRouter(prefix="/users",
                   tags=['users'],
                   dependencies=[Depends(get_token_header)])

# # The import system in python is a joke
# import os
# import sys

# SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# sys.path.append(os.path.dirname(SCRIPT_DIR))


class LoginCreds(BaseModel):
    password: str
    login: str
    name: Optional[str] = None


@router.post('/create')
async def create_user(creds: LoginCreds):
    sess.add(t.Users(
        login=creds.login,
        password=creds.password,
        name=creds.name,
        api_key=uuid.uuid4().hex
    ))
    sess.commit()


@router.post('/users')
async def login_user(creds: LoginCreds, tags=['users']):
    # TODO: add password hash security check
    user = sess.query(t.Users).\
        filter(t.Users.login == creds.login).\
        filter(t.Users.password == creds.password).first()
    if user:
        return user
    return {'error': 'Неверный логин или пароль'}


@router.post('/auth')
async def login_user(creds: LoginCreds):
    # TODO: add password hash security check
    user = sess.query(t.Users).\
        filter(t.Users.login == creds.login).\
        filter(t.Users.password == creds.password).first()
    if user:
        return user
    return {'error': 'Неверный логин или пароль'}

