import fs from 'fs'
import os from 'os'
import path from 'path'
import { store } from '../api/main/storage'

interface Command {
    elevate: boolean,
    install: string
}

const installationPaths = {
    golang: ['C:\\Program Files\\Go\\bin\\go.exe', 'C:\\Program Files (x86)\\Go\\bin\\go.exe'],
    git: ['C:\\Program Files\\Git\\cmd\\git.exe'],
    python3: [`C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\Python\\Python310\\python.exe`,
        'C:\\Python310\\python.exe',
    `C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\Python\\Python310\\python.exe`],
    choco: ["C:\\ProgramData\\chocolatey\\bin\\choco.exe"]
}



function checkInstalled(manager: string, pkgName: string): boolean {

    if (['choco', 'custom'].includes(manager)) {
        for (const installPath of installationPaths[pkgName]) {
            if (fs.existsSync(installPath)) {
                store.set(`pkgs.${pkgName}`, installPath)
                return true
            }
        }
    }
    if (manager === 'pip') {
        for (const pythonPath of installationPaths.python3) {
            const pythonDir = path.parse(pythonPath).dir
            pkgName = pkgName.replace('.py', '') //because discord.py creator is a fucking moron
            if (fs.existsSync(path.join(pythonDir, 'site-packages', pkgName))) {
                return true
            }
            if (fs.existsSync(path.join(pythonDir, 'Lib/site-packages', pkgName))) {
                return true
            }
        }
    }
    return false
}

const chocoCommand = (pkgName: string, version: string | null): Command => {

    const cmd = []
    cmd.push(store.get('pkgs.choco'))
    cmd.push('install -y')
    cmd.push(pkgName)
    if (version !== undefined) {
        cmd.push(`--version=${version}`)
    }
    return { elevate: true, install: cmd.join(' ') }
}

const pipCommand = (pkgName: string, version: string): Command => {
    const cmd = []
    cmd.push(store.get('pkgs.python3'))
    cmd.push('-m')
    cmd.push('pip install')
    if (version !== undefined) {
        cmd.push(`${pkgName}==${version}`)
    }
    else {
        cmd.push(pkgName)
    }
    const platform = process.platform
    platform === 'win32' ? cmd.push('--user') : null
    return { elevate: false, install: cmd.join(' ') }
}

const customCommand = (pkgName: string, version?: string): Command => {
    const cmds = {
        'choco': "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(''https://community.chocolatey.org/install.ps1''))"
    }
    return { elevate: true, install: cmds[pkgName] }
}

const commandBuilder = {
    'pip': pipCommand,
    'choco': chocoCommand,
    'custom': customCommand
}

export { commandBuilder, checkInstalled }