const templates = {
    'Python': {
        lib: ['choco python3=10.0.1'],
        http: 'https://github.com/SergeyKalutsky/python_base.git',
    },
    'Python Flask' : {
        lib: ['choco python3=10.0.1', 'pip flask', 'pip flask_login', 'pip sqlalchemy'],
        http: 'https://github.com/SergeyKalutsky/flask_base.git',
    },
    'Python Discord' : {
        lib: ['choco python3=10.0.1', 'pip discord.py'],
        http: 'https://github.com/SergeyKalutsky/discord_template.git',
    },
    'Python Pgzero' : {
        lib: ['choco python3=10.0.1', 'pip pgzero'],
        http: 'https://github.com/SergeyKalutsky/pgzero_template.git',
    }

}
export default templates