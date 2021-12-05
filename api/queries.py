from .database import sess, t
from .schemas import Member, Project, User
from .security import hashed_password


def delete_member(project_id: int, user_id: int):
    sess.query(t.Members).\
        filter(t.Members.project_id == project_id).\
        filter(t.Members.user_id == user_id).delete()
    sess.commit()


def list_project_members(project_id: int):
    return sess.query(t.Users).\
        filter(t.Members.project_id == project_id).\
        filter(t.Members.user_id == t.Users.id).\
        filter(t.Members.is_userowner == False).all()


def add_project_member(user_id: int,
                       project_id: int,
                       is_userowner: bool,
                       membership_accepted: bool,
                       access: str):
    sess.add(t.Members(
        user_id=user_id,
        project_id=project_id,
        is_userowner=is_userowner,
        membership_accepted=membership_accepted,
        access=access
    ))
    sess.commit()


def get_is_classroom(project_id: int):
    return sess.query(t.Projects.isclassroom).\
        filter(t.Projects.id == project_id).first()[0]


def delete_project(project_id: int):
    sess.query(t.Projects).\
        filter(t.Projects.id == project_id).delete()
    sess.query(t.Members).\
        filter(t.Members.project_id == project_id).delete()
    sess.commit()


def get_is_userowner(user_id: int, project_id: int):
    is_userowner = sess.query(t.Members.is_userowner).\
        filter(t.Members.user_id == user_id).\
        filter(t.Members.project_id == project_id).first()[0]
    return is_userowner


def list_projects_by_user_id(user_id: int):
    projects = sess.query(t.Projects).\
        filter(t.Members.project_id == t.Projects.id).\
        filter(t.Members.user_id == user_id).all()
    return projects


def project_already_exists(name: str):
    res = sess.query(t.Projects).filter(t.Projects.name == name).first()
    if res is None:
        return False
    return True


def add_new_project(project: Project,
                    user_id: int,
                    membership_accepted: int,
                    access: str):
    sess.add(t.Projects(
        id=project.id,
        isclassroom=project.isclassroom,
        name=project.name,
        http=project.http
    ))
    sess.add(t.Members(
        user_id=user_id,
        project_id=project.id,
        is_userowner=True,
        membership_accepted=membership_accepted,
        access=access
    ))
    sess.commit()


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


def change_membership_status(user_id: int, member: Member):
    sess.query(t.Members).\
        filter(t.Members.user_id == user_id).\
        filter(t.Members.project_id == member.project_id).\
        update({'membership_accepted': member.membership_accepted})
    sess.commit()
