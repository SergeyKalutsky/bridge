import fs from 'fs'
import os from 'os'
import { store } from '../api/main/storage'

const installationPaths = {
    git: ['C:\\Program Files\\Git\\cmd\\git.exe'],
    python: [`C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\Python\\Python310\\python.exe`,
        'C:\\Python310\\python.exe'],
    choco: "C:\\ProgramData\\chocolatey\\bin\\choco.exe"
}


interface Command {
    elevate: boolean,
    install: string
}

async function checkInstalled(pkg: string): Promise<any> {

    if (fs.existsSync(installationPaths[pkg])) {
        return true
    }
    return false

}

const chocoInstall = (pkgName: string, version: string | null): Command => {
    const cmd = []
    cmd.push(store.get('pkgs.Choco'))
    cmd.push('install -y')
    cmd.push(pkgName)
    if (version !== null) {
        cmd.push(`--version=${version}`)
    }
    return { elevate: true, install: cmd.join(' ') }
}

const pipInstall = (pkgName: string): Command => {
    const cmd = []
    cmd.push(store.get('pkgs.Python'))
    cmd.push('-m')
    cmd.push('pip install')
    cmd.push(pkgName)
    const platform = process.platform
    platform === 'win32' ? cmd.push('--user') : null
    return { elevate: false, install: cmd.join(' ') }
}
// win32: "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(''https://community.chocolatey.org/install.ps1''))"



export { chocoInstall, pipInstall, checkInstalled }