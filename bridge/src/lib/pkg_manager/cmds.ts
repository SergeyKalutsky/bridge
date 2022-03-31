import os from 'os'


const CMD = {
    git: {
        elevate: true,
        install: {
            linux: "sudo apt install git",
            win32: "choco install -y git"
        },
        check: {
            cmd: 'git --version',
            string: 'git version'
        },
        path: {
            win32: ';C:\\Program Files\\Git\\cmd'
        }
    },
    python: {
        elevate: true,
        install: {
            linux: "sudo apt-get install python3.10",
            win32: "choco install -y python3 --version=3.10.1"
        },
        check: {
            cmd: 'python --version',
            string: 'Python 3'
        },
        path: {
            win32: `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\Python\\Python39`
        }
    },
    choco: {
        elevate: true,
        install: {
            win32: "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(''https://community.chocolatey.org/install.ps1''))"
        },
        check: {
            cmd: 'choco',
            string: 'Chocolatey'
        },
        path: {
            win32: ';C:\\ProgramData\\chocolatey\\bin'
        }
    },
    pgzero: {
        elevate: false,
        install: {
            win32: 'pip install pgzero --user',
            darwin: 'pip install pgzero'
        },
        check: {
            cmd: 'pip list | Select-String "pgzero"',
            string: 'pgzero'
        },
    },
    'discord.py': {
        elevate: false,
        install: {
            win32: 'pip install discord.py --user',
            darwin: 'pip install discord.py'
        },
        check: {
            cmd: 'pip list | Select-String "discord"',
            string: 'discord'
        }
    },
    requests: {
        elevate: false,
        install: {
            win32: 'pip install requests --user',
            darwin: 'pip install requests'
        },
        check: {
            cmd: 'pip list | Select-String "requests"',
            string: 'requests'
        }
    },
    flask_login: {
        elevate: false,
        install: {
            win32: 'pip install flask_login --user',
            darwin: 'pip install flask_login'
        },
        check: {
            cmd: 'pip list | Select-String "Flask-Login"',
            string: 'Flask-Login'
        }
    },
    sqlalchemy: {
        elevate: false,
        install: {
            win32: 'pip install sqlalchemy --user',
            darwin: 'pip install sqlalchemy'
        },
        check: {
            cmd: 'pip list | Select-String "SQLAlchemy"',
            string: 'SQLAlchemy'
        }
    },
    flask: {
        elevate: false,
        install: {
            win32: 'pip install flask --user',
            darwin: 'pip install flask'
        },
        check: {
            cmd: 'pip list | Select-String "Flask"',
            string: 'Flask'
        }
    }
}

export default CMD