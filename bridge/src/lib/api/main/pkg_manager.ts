import { ipcMain } from 'electron';
import { elevatedShell, checkInstalled } from '../../pkg_manager'
import CMD from "../../pkg_manager/cmds";
import { spawn } from 'child_process'
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
        console.log(pkgs)
        let commandElevated = ''
        let commandNormal = ''
        const platform = process.platform;
        for (const pkg of pkgs) {
            const pkg_info = CMD[pkg]
            if (pkg_info.elevate) {
                commandElevated += CMD[pkg].install[platform] + '; '
            } else {
                commandNormal += CMD[pkg].install[platform] + '; '
            }
        }
        elevatedShell({ command: commandElevated },
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
        // const child = spawn(commandNormal, { shell: true })
        // child.on('data', (data) => {
        //     event.reply('pkg:getlogs', data.toString())
        // })
    })
}

function pkgAPI(): void {
    getLogs()
    check()
    pkgInstall()
}

export default pkgAPI


