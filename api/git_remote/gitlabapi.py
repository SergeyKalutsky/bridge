# sergey ID 34
# Jdoe ID 35
import gitlab

gl = gitlab.Gitlab('https://gitlab.bridgeacross.xyz',
                   private_token='Yyw3diYYbsAimWmXpwn2')


def create_project(user_id, project):
    user = gl.users.get(user_id)
    project = user.projects.create({'name': project.repo,
                                    'description': project.description})
    return project.id


def delete_user_project(user_id, project_name):
    projects = gl.users.get(user_id).projects.list()
    for project in projects:
        if project.name == project_name:
            gl.projects.delete(project.id)


def create_user(email, password, username, name):
    # TODO: after creating a user add him with id to the DB
    gl.users.create({'email': email,
                     'password': password,
                     'username': username,
                     'name': name,
                     'skip_confirmation': True})


def delete_user(username):
    user = gl.users.list(search=username)[0]
    gl.users.delete(user.id)


def get_project_by_name(name):
    return gl.projects.list(search=name)[0]


def add_project_member(user_id, project_id):
    project = gl.projects.get(project_id)
    project.members.create({'user_id': user_id,
                            'access_level': gitlab.DEVELOPER_ACCESS})
