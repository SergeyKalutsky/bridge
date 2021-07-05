from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from .db import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    login = Column(String, unique=True, index=True)
    password = Column(String)
    ssh_pub_key = Column(String)


class Rooms(Base):
    __tablename__ = 'rooms'

    id = Column(Integer, primary_key=True, index=True)
    room_type = Column(Integer)
    repo = Column(String, unique=True)
    isuserowner = Column(Integer)
    branch = Column(String)
