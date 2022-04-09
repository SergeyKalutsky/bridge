import fs from 'fs'
import os from 'os'
import path from 'path'
import { store } from '../api/main/storage'

interface Command {
    elevate: boolean,
    install: string
}

const installationPaths = {
    git: ['C:\\Program Files\\Git\\cmd\\git.exe'],
    python: [`C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\Python\\Python310\\python.exe`,
        'C:\\Python310\\python.exe'],
    choco: ["C:\\ProgramData\\chocolatey\\bin\\choco.exe"]
}



function checkInstalled(manager: string, pkg: string): boolean {

    if (['choco', 'custom'].includes(manager)) {
        for (const installPath of installationPaths[pkg]) {
            if (fs.existsSync(installPath)) {
                store.set('pkgs.choco', installPath)
                return true
            }
        }
    }
    if (manager === 'pip') {
        for (const pythonPath of installationPaths.python) {
            const pythonDir = path.parse(pythonPath).dir
            if (fs.existsSync(path.join(pythonDir, 'site-packages', pkg))) {
                return true
            }
            if (fs.existsSync(path.join(pythonDir, 'Lib/site-packages', pkg))) {
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
    cmd.push(store.get('pkgs.python'))
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

const customCommand =  (pkgName: string, version?: string): Command => {
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