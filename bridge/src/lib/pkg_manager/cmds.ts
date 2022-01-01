const CMD = {
    git: {
        install: {
            linux: "sudo apt install git",
            win32: "choco install -y git"
        },
        check: {
            cmd: 'git --version',
            string: 'git version'
        }
    },
    vscode: {
        install: {
            linux: "sudo snap install --classic code",
            win32: "choco install -y vscode"
        }
    },
    python: {
        install: {
            linux: "sudo apt-get install python3.10",
            win32: "choco install -y python3 --version=3.10.1"
        },
        check: {
            cmd: 'python --version',
            string: 'Python 3'
        }
    },
    choco: {
        install: {
            win32: "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
        },
        check: {
            cmd: 'choco',
            string: 'Chocolatey'
        }
    }
}

export default CMD