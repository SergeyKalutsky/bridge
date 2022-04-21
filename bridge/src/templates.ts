const platform = window.settings.platform()
const templates = {
    'init': {
        pkgs: [{
            installed: null,
            name: platform === 'win32' ? 'choco' : 'brew',
            manager: 'custom',
        },
        {
            installed: null,
            name: 'git',
            manager: platform === 'win32' ? 'choco' : 'brew',
        }]
    },
    'Python': {
        pkgs: [{
            installed: null,
            name: 'python3',
            manager: platform === 'win32' ? 'choco' : 'brew',
            version: '10.0.1'
        }],
        http: 'https://github.com/SergeyKalutsky/python_base.git',
    },
    'Python Flask': {
        pkgs: [{
            installed: null,
            name: 'python3',
            manager: platform === 'win32' ? 'choco' : 'brew',
            version: '10.0.1'
        },
        {
            installed: null,
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
            manager: platform === 'win32' ? 'choco' : 'brew',
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
            manager: platform === 'win32' ? 'choco' : 'brew',
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