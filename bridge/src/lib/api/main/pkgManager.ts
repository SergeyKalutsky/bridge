import { shell, checkInstalled, commandBuilder } from '../../pkgManager'
import { ipcMain } from 'electron';
import { LOG_PATH } from './storage';
import util from 'util'
import fs from 'fs'


const readFileAsync = util.promisify(fs.readFile)

function check() {
    return ipcMain.on('pkg:check', async (event, pkgs) => {
        pkgs = await Promise.all(pkgs.map(async (pkg) => {
            pkg.installed = await checkInstalled(pkg.manager, pkg.name)
            return pkg
        }))
        event.reply('pkg:check', pkgs)
    })
}

function getLogs() {
    return ipcMain.on('pkg:getlogs', async (event) => {
        if (fs.existsSync(LOG_PATH)) {
            fs.stat(LOG_PATH, async (err, stats) => {
                // We only read and send logs if logs were updated less then 3 seconds ago
                const currentDate = new Date();
                const updateFileDate = new Date(stats.mtime)
                const timeDiff = Math.abs(updateFileDate.getTime() - currentDate.getTime()) / 1000
                if (timeDiff < 3) {
                    const fileContent = await readFileAsync(LOG_PATH, 'utf-8')
                    event.reply('pkg:getlogs', fileContent)
                }
            })

        }
    })
}

function pkgInstall() {
    ipcMain.on('pkg:install', async (event, pkgs) => {
        // Add separator to log file
        const updatePkgs = []
        for (const pkg of pkgs) {
            if (!pkg.installed) {
                const cmd = commandBuilder[pkg.manager](pkg.name, pkg.verison)
                await shell({ command: cmd.install, path: LOG_PATH, elevate: cmd.elevate })
                pkg.installed = await checkInstalled(pkg.manager, pkg.name)
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


