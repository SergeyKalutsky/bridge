const templates = {
    'Python': {
        lib: ['python'],
        http: 'https://github.com/SergeyKalutsky/python_base.git',
    },
    'Python Flask' : {
        lib: ['python', 'flask', 'flask_login', 'sqlalchemy'],
        http: 'https://github.com/SergeyKalutsky/flask_base.git',
    },
    'Python Discord' : {
        lib: ['python', 'discord.py'],
        http: 'https://github.com/SergeyKalutsky/discord_template.git',
    },
    'Python Pgzero' : {
        lib: ['python', 'pgzero'],
        http: 'https://github.com/SergeyKalutsky/pgzero_template.git',
    }

}
export default templates