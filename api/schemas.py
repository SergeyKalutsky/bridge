from typing import Optional
from pydantic import BaseModel


class ReturnMember(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class ReturnProjects(BaseModel):
    id: int
    name: str
    isclassroom: int
    http: str

    class Config:
        orm_mode = True


class ReturnUser(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class Member(BaseModel):
    user_id: Optional[int] = None
    project_id: Optional[int] = None
    is_userowner: Optional[int] = None
    membership_accepted: Optional[int] = None
    access: Optional[str] = None


class User(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    login: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None


class Project(BaseModel):
    id: Optional[int]
    key: Optional[str]
    name: Optional[str]
    isclassroom: Optional[bool] = None
    description: Optional[str] = ''
    http: Optional[str] = ''
