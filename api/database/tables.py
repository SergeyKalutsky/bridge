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


class Projects(Base):

    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    isclassroom = Column(Boolean)
    name = Column(String, unique=True)


class Members(Base):

    __tablename__ = 'members'

    user_id = Column(Integer, primary_key=True)
    project_id = Column(Integer, primary_key=True)
    is_userowner = Column(Boolean)
    membership_accepted = Column(Boolean)


class Classroom(Base):
    
    __tablename__ = 'classroom'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, primary_key=True)
    project_id = Column(Integer, primary_key=True)
    is_teacher = Column(Boolean)