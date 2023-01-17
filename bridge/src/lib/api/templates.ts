const platform = process.platform;
export const templates = [
    {
        name: '🐍 Python',
        pkgs: [{
            installed: null,
            name: platform === 'win32' ? 'choco' : 'brew',
            manager: 'shell',
        }, {
            installed: null,
            name: 'python3',
            manager: platform === 'win32' ? 'choco' : 'brew',
            version: '10.0.1'
        }],
        http: 'https://github.com/SergeyKalutsky/python_base.git',
        description: 'Python3.9 \n Python — высокоуровневый язык программирования общего назначения с динамической строгой типизацией и автоматическим управлением памятью, ориентированный на повышение производительности разработчика, читаемости кода и его качества, а также на обеспечение переносимости написанных на нём программ.'
    },
    {
        name: '🕸️ Python Flask',
        pkgs: [{
            installed: null,
            name: platform === 'win32' ? 'choco' : 'brew',
            manager: 'shell',
        }, {
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
        description: 'Flask — фреймворк для создания веб-приложений на языке программирования Python, использующий набор инструментов Werkzeug, а также шаблонизатор Jinja2. Относится к категории так называемых микрофреймворков — минималистичных каркасов веб-приложений, сознательно предоставляющих лишь самые базовые возможности.'

    },
    {
        name: '🕸️ Python Django',
        pkgs: [{
            installed: null,
            name: platform === 'win32' ? 'choco' : 'brew',
            manager: 'shell',
        }, {
            installed: null,
            name: 'python3',
            manager: platform === 'win32' ? 'choco' : 'brew',
            version: '10.0.1'
        },
        {
            installed: null,
            name: 'django',
            manager: 'pip',
            version: '2.0'
        },
        {
            installed: null,
            name: 'sqlalchemy',
            manager: 'pip',
        }],
        http: 'https://github.com/fasouto/django-starter-template.git',
        description: 'Django is a free and open-source, Python-based web framework that follows the model–template–views architectural pattern. It is maintained by the Django Software Foundation'
    },
    {
        name: '🤖 Python Discord',
        pkgs: [{
            installed: null,
            name: platform === 'win32' ? 'choco' : 'brew',
            manager: 'shell',
        }, {
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
        description: 'Проект позволяющий создовать проекты на discord'
    },
    {
        name: '0️⃣ Python Pgzero',
        pkgs: [{
            installed: null,
            name: platform === 'win32' ? 'choco' : 'brew',
            manager: 'shell',
        }, {
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
        description: 'Pygame Zero is for creating games without boilerplate. It is intended for use in education, so that teachers can teach basic programming without needing to explain the Pygame API or write an event loop.'
    }
]