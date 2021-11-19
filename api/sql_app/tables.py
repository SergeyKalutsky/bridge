from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Boolean

from .db import Base


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True)
    name = Column(String)
    password = Column(String)
    api_key = Column(String, unique=True)


class Projects(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Integer)
    name = Column(String, unique=True)
    key = Column(String)

class Members(Base):

    __tablename__ = 'members'

    user_id = Column(Integer, primary_key=True)
    project_id = Column(Integer, primary_key=True)
    is_userowner = Column(Boolean)