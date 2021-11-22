from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = r"sqlite:///C:\Users\skalutsky\lib\bridge\api\database\db.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
local_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
sess = local_session()

Base = declarative_base()
