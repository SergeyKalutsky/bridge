from database import sess, t
from schemas import User
from security import hashed_password


def find_user_by_name(user_name_to_search: str,
                      searching_user_id: int):
    return sess.query(t.Users).\
        filter(t.Users.name.contains(f'{user_name_to_search}%')).\
        filter(t.Users.id != searching_user_id).all()


def add_new_user(user: User):
    sess.add(t.Users(
        login=user.login,
        password=hashed_password(user.password),
        name=user.name,
        id=user.id
    ))
    sess.commit()
