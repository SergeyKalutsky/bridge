from ..main import app
from fastapi.testclient import TestClient
from ..database import sess, t
from ..security import encode_auth_token

client = TestClient(app)
TOKEN = encode_auth_token(0)


def test_users_find():
    name = "nik"
    res = client.post(
        '/users/find',
        headers={'x-api-key': TOKEN},
        json={
            "name": name
        }
    )
    assert res.status_code == 200
    q = sess.query(t.Users.id, t.Users.name).\
        filter(t.Users.name.contains(f'%{name}%')).all()
    sample_data = [list(i) for i in q]
    assert res.json() == sample_data


def test_auth():
    res = client.post(
        '/auth',
        json={
            "password": "rjyrehc1",
            "login": "root"
        }
    )
    assert res.status_code == 200
    assert res.json()['status'] == 'success'
