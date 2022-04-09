import { shell, checkInstalled, commandBuilder } from '../../pkg_manager'
import { app, ipcMain } from 'electron';
import path from 'path'
import util from 'util'
import fs from 'fs'

const readFileAsync = util.promisify(fs.readFile)

function check() {
    return ipcMain.on('pkg:check', async (event, pkgs) => {
        console.log(pkgs)
        pkgs = pkgs.map(pkg => {
            pkg.installed = checkInstalled(pkg.manager, pkg.name)
            return pkg
        })
        event.reply('pkg:check', pkgs)
    })
}

function getLogs() {
    return ipcMain.on('pkg:getlogs', async (event) => {
        const logPath = path.join(app.getPath('userData'), 'bridge.log')
        if (fs.existsSync(logPath)) {
            const fileContent = await readFileAsync(logPath, 'utf-8')
            event.reply('pkg:getlogs', fileContent)
        }
    })
}

function pkgInstall() {
    ipcMain.on('pkg:install', async (event, pkgs) => {
        const logPath = path.join(app.getPath('userData'), 'bridge.log')
        const updatePkgs = []
        for (const pkg of pkgs) {
            if (!pkg.installed) {
                const cmd = commandBuilder[pkg.manager](pkg.name, pkg.verison)
                await shell({ command: cmd.install, path: logPath, elevate: cmd.elevate })
                pkg.installed = checkInstalled(pkg.manager, pkg.name)
            }
            updatePkgs.push(pkg)
        }
        event.reply('pkg:check', updatePkgs)
    })
}

function pkgAPI(): void {
    getLogs()
    pkgInstall()
    check()
}

export default pkgAPI


