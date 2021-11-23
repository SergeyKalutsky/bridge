from fastapi import Header, HTTPException
import jwt

async def verify_token(x_api_key: str = Header(None)):
    try:
        payload = jwt.decode(x_api_key, 'SECRET_KEY', algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail='Signature expired. Please log in again.')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail='Invalid token. Please log in again.')