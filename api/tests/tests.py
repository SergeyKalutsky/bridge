from ..main import app
from fastapi.testclient import TestClient


client = TestClient(app)


def test_users_find():
    res = client.post(
        '/users/find',
        headers={'api-key': 'e6b2c842e83c4c01948c792534408e11',
                 'user-id': '34'},
        json={
            "name": "nik"
        }
    )
    assert res.status_code == 200
    assert res.json() == [
        {
            "id": 37,
            "name": "nikita"
        }
    ]
