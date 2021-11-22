from fastapi import Header, HTTPException
from .database import sess, t


def auth(user_id, api_key):
    print
    db_api_key = sess.query(t.Users.api_key).\
        filter(t.Users.id == user_id).first()[0]
    if db_api_key == api_key:
        return True
    return False


async def get_token_header(api_key: str = Header(None),
                           user_id: str = Header(None)):
    if not auth(user_id, api_key):
        raise HTTPException(status_code=400, detail="API-Token header invalid")
