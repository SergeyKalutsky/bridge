import { shell, checkInstalledApp, commandBuilder } from '../../pkg_manager'
import { app, ipcMain } from 'electron';
import path from 'path'
import util from 'util'
import fs from 'fs'

const readFileAsync = util.promisify(fs.readFile)


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
    ipcMain.on('pkg:install', async (event, data) => {
        const pkgs = data.pkgs
        const logPath = path.join(app.getPath('userData'), 'bridge.log')
        for (const pkg of pkgs) {
            const [manager, pkgInfo] = pkg.split(' ')
            const [pkgName, pkgVersion] = pkgInfo.split('=')
            
            let installed = await checkInstalledApp(manager, pkgName)
            if (!installed) {
                const cmd = commandBuilder[manager](pkgName, pkgVersion)
                await shell({ command: cmd.cmd, path: logPath, elevate: cmd.elevate })
                installed = await checkInstalledApp(manager, pkgName)
            }
            // After installation store path in pkgs
            event.reply('pkg:check', { installed: installed, pkg: pkg })
        }
    })
}

function pkgAPI(): void {
    getLogs()
    pkgInstall()
}

export default pkgAPI


