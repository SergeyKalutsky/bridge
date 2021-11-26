from os import access
import gitlab

gl = gitlab.Gitlab('https://gitlab.bridgeacross.xyz',
                   private_token='Yyw3diYYbsAimWmXpwn2')


def create_project(user_id, project):
    user = gl.users.get(user_id)
    project = user.projects.create({'name': project.name,
                                    'description': project.description})
    return project.id


def delete_user_project(user_id, project_name):
    projects = gl.users.get(user_id).projects.list()
    for project in projects:
        if project.name == project_name:
            gl.projects.delete(project.id)


def create_user(creds):
    user = gl.users.create({'email': creds.email,
                     'password':creds.password,
                     'username': creds.login,
                     'name': creds.name,
                     'skip_confirmation': True})
    return user.id


def delete_user(username):
    user = gl.users.list(search=username)[0]
    gl.users.delete(user.id)


def get_project_by_name(name):
    return gl.projects.list(search=name)[0]


def add_project_member(member, access):
    project = gl.projects.get(member.project_id)
    project.members.create({'user_id': member.user_id,
                            'access_level': getattr(gitlab, f'{access.upper()}_ACCESS')})


def remove_member(member):
    project = gl.projects.get(member.project_id)
    project.members.delete(member.user_id)