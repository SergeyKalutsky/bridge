const templates = {
    Python: {
        apps: ['python'],
        template: 'https://github.com/SergeyKalutsky/python_base.git',
    },
    'Python Flask' : {
        apps: ['python'],
        template: 'https://github.com/SergeyKalutsky/flask_base.git',
        cmd: 'pip install -r requirements.txt'
    },
    'Python Discord' : {
        apps: ['python'],
        template: 'https://github.com/SergeyKalutsky/discord_template.git',
        cmd: 'pip install requirements.txt'
    },
    'Python Pgzero' : {
        apps: ['python'],
        template: 'https://github.com/SergeyKalutsky/pgzero_template.git',
        cmd: 'pip install requirements.txt'
    }

}
export default templates