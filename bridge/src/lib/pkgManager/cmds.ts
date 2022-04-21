import fs from 'fs'
import os from 'os'
import path from 'path'
import { store } from '../api/main/storage'
import { exec } from 'child_process'
import util from 'util'


const promisifiedExec = util.promisify(exec);

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
    choco: ["C:\\ProgramData\\chocolatey\\bin\\choco.exe"],
    brew: ['/opt/homebrew/bin/brew', '/usr/local/homebrew/bin/brew']
}



async function checkInstalled(manager: string, pkgName: string): Promise<boolean> {
    // If we install custom we need to find the installation path, because its a pkg manager
    // and that will save as from reloading applicaitions env values as well as different version
    // conflicts. On windows there is no "good" way to find installation path
    // so we resort to searching in all default paths as a lesser evel for all apps
    if (['choco', 'custom'].includes(manager)) {
        for (const installPath of installationPaths[pkgName]) {
            if (fs.existsSync(installPath)) {
                store.set(`pkgs.${pkgName}`, installPath)
                return true
            }
        }
    }
    if (manager === 'pip') {
        try {
            await promisifiedExec(store.get('pkgs.python3') + ` -m pip show ${pkgName}`)
        } catch (error) {
            return false
        }
        return true
    }
    // My guess is all binaries in brew are accesseble where brew is itself
    //  works for Montery, need to test for the rest 
    if (manager === 'brew') {
        const binary = path.join(path.parse(store.get('pkgs.brew')).dir, pkgName)
        if (fs.existsSync(binary)) {
            store.set(`pkgs.${pkgName}`, binary)
            return true
        }
    }
    return false
}

const brewCommand = (pkgName: string, version: string | null): Command => {
    const cmd = []
    cmd.push(store.get('pkgs.brew'))
    cmd.push('install')
    cmd.push(pkgName)
    return { elevate: false, install: cmd.join(' ') }
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
        'choco': "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(''https://community.chocolatey.org/install.ps1''))",
        // -- it only prompts if stdin is a TTY. So we echo the output
        // to run script in a noninteractive mode
        'brew': `echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`

    }
    return { elevate: true, install: cmds[pkgName] }
}

const commandBuilder = {
    'pip': pipCommand,
    'choco': chocoCommand,
    'custom': customCommand,
    'brew': brewCommand
}

export { commandBuilder, checkInstalled }