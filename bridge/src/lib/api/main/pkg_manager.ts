import { ipcMain } from 'electron';
import CMD from "../../pkg_manager/cmds";
import { elevatedShell, checkInstalled } from '../../pkg_manager'
import path from 'path'
import util from 'util'
import fs from 'fs'
import os from 'os'

const readFileAsync = util.promisify(fs.readFile)


function getLogs() {
    return ipcMain.on('pkg:getlogs', async (event, pkgs) => {
        const logPath = path.join(os.tmpdir(), 'initInstallBridge.log')
        if (fs.existsSync(logPath)) {
            const fileContent = await readFileAsync(logPath, 'utf-8')
            event.reply('pkg:getlogs', fileContent)
        }
    })
}

function check() {
    return ipcMain.on('pkg:check', async (event, pkgs) => {
        for (const pkg of pkgs) {
            checkInstalled(pkg, (installed) => {
                event.reply('pkg:check', { installed: installed, pkg: pkg })
            })
        }
    })
}

function pkgInstall() {
    ipcMain.on('pkg:install', (event, pkgs) => {
        let command = ''
        const platform = process.platform;
        for (const pkg of pkgs) {
            command += CMD[pkg].install[platform] + '; '
        }
        elevatedShell({ command: command },
            async (error?: Error, data?: string | Buffer) => {
                if (data.toString() === 'refreshenv') {
                    for (const pkg of pkgs) {
                        if (!(process.env.Path.includes(CMD[pkg].path[platform]))) {
                            process.env.Path += CMD[pkg].path[platform]
                        }
                        checkInstalled(pkg, (installed) => {
                            event.reply('pkg:check', { installed: installed, pkg: pkg })
                        })
                    }
                }
            })
    })
}

function pkgAPI() {
    getLogs()
    check()
    pkgInstall()
}

export default pkgAPI


