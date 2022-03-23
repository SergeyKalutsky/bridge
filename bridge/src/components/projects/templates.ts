const templates = {
    'Python': {
        apps: ['python'],
        http: 'https://github.com/SergeyKalutsky/python_base.git',
    },
    'Python Flask' : {
        apps: ['python'],
        http: 'https://github.com/SergeyKalutsky/flask_base.git',
        cmd: 'pip install -r requirements.txt'
    },
    'Python Discord' : {
        apps: ['python'],
        http: 'https://github.com/SergeyKalutsky/discord_template.git',
        cmd: 'pip install -r requirements.txt'
    },
    'Python Pgzero' : {
        apps: ['python'],
        http: 'https://github.com/SergeyKalutsky/pgzero_template.git',
        cmd: 'pip install -r requirements.txt'
    }

}
export default templates