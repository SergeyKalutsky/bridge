from typing import Optional
from pydantic import BaseModel

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