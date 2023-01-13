import fs from 'fs'
import os from 'os'
import path from 'path'
import util from 'util'
import { exec } from 'child_process'
import { store } from '../api/storage'


const promisifiedExec = util.promisify(exec);

const installationPaths = {
    golang: ['C:\\Program Files\\Go\\bin\\go.exe', 'C:\\Program Files (x86)\\Go\\bin\\go.exe'],
    git: ['C:\\Program Files\\Git\\cmd\\git.exe'],
    python3: [`C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Programs\\Python\\Python310\\python.exe`,
        'C:\\Python310\\python.exe',
    `C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\Python\\Python310\\python.exe`],
    choco: ["C:\\ProgramData\\chocolatey\\bin\\choco.exe"],
    brew: ['/opt/homebrew/bin/brew', '/usr/local/homebrew/bin/brew']
}

export async function pip({ name }: { name: string }): Promise<boolean> {
    try {
        await promisifiedExec(store.get('pkgs.python3') + ` -m pip show ${name}`)
    } catch (error) {
        return false
    }
    return true
}

export async function brew({ name }: { name: string }): Promise<boolean> {
    // My guess is all binaries in brew are accesseble {brew_paht}/bin is itself
    //  works for Montery, need to test for the rest macOSs
    if (store.get('pkgs.brew') === undefined) {
        return false
    }
    const binary = path.join(path.parse(store.get('pkgs.brew')).dir, name)
    if (fs.existsSync(binary)) {
        store.set(`pkgs.${name}`, binary)
        return true
    }
}

export async function shell({ name }: { name: string }): Promise<boolean> {
    for (const installPath of installationPaths[name]) {
        if (fs.existsSync(installPath)) {
            store.set(`pkgs.${name}`, installPath)
            return true
        }
    }
    return false
}

export async function choco({ name }: { name: string }): Promise<boolean> {
    // If we install through choco we need to find the installation path ourself.
    // Since choco do not provide this utility after installation and 
    // arguments for custom installation are available only in a paid verison -_-
    // On windows there is no "good" way to find installation path
    // so we resort to searching in all default paths as a lesser evil for all apps
    for (const installPath of installationPaths[name]) {
        if (fs.existsSync(installPath)) {
            store.set(`pkgs.${name}`, installPath)
            return true
        }
    }
    return false
}
