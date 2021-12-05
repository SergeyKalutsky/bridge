from ..main import app
from fastapi.testclient import TestClient
from ..security import encode_auth_token
from ..queries import find_user_by_name

client = TestClient(app)
USER_ID = 0
TOKEN = encode_auth_token(USER_ID)


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
    q = find_user_by_name(name, USER_ID)
    assert res.json() == [{'id': i.id, 'name': i.name} for i in q]


def test_auth():
    res = client.post(
        '/auth',
        json={
            "password": "rjyrehc1",
            "login": "sergey"
        }
    )
    assert res.status_code == 200


def test_list_members():
    pass


def test_add_member():
    pass


def test_delete_member():
    pass
