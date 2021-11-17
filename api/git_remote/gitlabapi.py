# sergey ID 34
# Jdoe ID 35
import gitlab

gl = gitlab.Gitlab('https://gitlab.bridgeacross.xyz',
                   private_token='Yyw3diYYbsAimWmXpwn2')


def create_project(user_name, project_name, description):
    user = gl.users.list(username=user_name)[0]
    user.projects.create({'name': project_name,
                          'description': description})


def get_user_projects(user_name):
    user = gl.users.list(username=user_name)[0]
    return user.projects.list()


def delete_user_project(user_name, project_name):
    projects = get_user_projects(user_name)
    for project in projects:
        if project.name == project_name:
            gl.projects.delete(project.id)


def create_user(email, password, username, name):
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
