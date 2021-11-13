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
                     'name': name})


def delete_user(username):
    user = gl.users.list(search=username)[0]
    gl.users.delete(user.id)
