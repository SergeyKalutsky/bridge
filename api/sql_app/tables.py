from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from .db import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    login = Column(String, unique=True, index=True)
    password = Column(String)
    room_id = Column(Integer)


class Rooms(Base):
    __tablename__ = 'rooms'

    id = Column(Integer, primary_key=True, index=True)
    room_type = Column(Integer)
    repo = Column(String, unique=True)
    members_id = Column(Integer)


class Members(Base):
    __tablename__ = 'members'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    role = Column(String)
    branch = Column(String)
    room_id = Column(String)
