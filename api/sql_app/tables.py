from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from .db import Base


class User(Base):
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
    repo = Column(String, unique=True)
    isuserowner = Column(Integer)
    branch = Column(String)
    key = Column(String)
