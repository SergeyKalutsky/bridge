#!python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import projects, users, members
from .types import User
from .database import sess, t
from .security import encode_auth_token, check_password

app = FastAPI()
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(members.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/auth')
async def login_user(user: User):
    db_user = sess.query(t.Users).\
        filter(t.Users.login == user.login).first()
    if check_password(user.password, db_user.password):
        return {'X-API-Key': encode_auth_token(db_user.id)}
    return {'status': 'auth failed', 'error': 'Неверный логин или пароль'}
