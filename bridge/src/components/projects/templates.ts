const templates = {
    'Python': {
        pkgs: [{
            installed: null,
            name: 'python3',
            manager: 'choco',
            version: '10.0.1'
        }],
        http: 'https://github.com/SergeyKalutsky/python_base.git',
    },
    'Python Flask': {
        pkgs: [{
            installed: null,
            name: 'python3',
            manager: 'choco',
            version: '10.0.1'
        },
        {
            installed: null,
        pkgs: ['choco python3=10.0.1', 'pip pgzero'],
            name: 'flask',
            manager: 'pip',
        },
        {
            installed: null,
            name: 'sqlalchemy',
            manager: 'pip',
        }],
        http: 'https://github.com/SergeyKalutsky/flask_base.git',
    },
    'Python Discord': {
        pkgs: [{
            installed: null,
            name: 'python3',
            manager: 'choco',
            version: '10.0.1'
        },
        {
            installed: null,
            name: 'discord.py',
            manager: 'pip',
        }],
        http: 'https://github.com/SergeyKalutsky/discord_template.git',
    },
    'Python Pgzero': {
        pkgs: [{
            installed: null,
            name: 'python3',
            manager: 'choco',
            version: '10.0.1'
        },
        {
            installed: null,
            name: 'pgzero',
            manager: 'pip',
        }],
        http: 'https://github.com/SergeyKalutsky/pgzero_template.git',
    }

}
export default templates