import { shell, checkInstalled, commandBuilder } from '../../pkg_manager'
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
    ipcMain.on('pkg:install', async (event, pkgs) => {
        const logPath = path.join(app.getPath('userData'), 'bridge.log')
        for (const pkg of pkgs) {
            const [manager, pkgInfo] = pkg.split(' ')
            const [pkgName, pkgVersion] = pkgInfo.split('=')

            // let installed = await checkInstalled(manager, pkgName)
            let installed = false
            if (!installed) {
                const cmd = commandBuilder[manager](pkgName, pkgVersion)
                await shell({ command: cmd.install, path: logPath, elevate: cmd.elevate })
                // After installation store path in pkgs
                installed = await checkInstalled(manager, pkgName)
            }
            event.reply('pkg:check', { installed: installed, pkg: pkg })
        }
    })
}

function pkgAPI(): void {
    getLogs()
    pkgInstall()
}

export default pkgAPI


