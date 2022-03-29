import { elevatedShell, checkInstalled } from '../../pkg_manager'
import { ipcMain } from 'electron';
import { spawn } from 'child_process'
import { BASE_DIR } from './storage';
import CMD from "../../pkg_manager/cmds";
import path from 'path'
import util from 'util'
import fs from 'fs'
import os from 'os'

const readFileAsync = util.promisify(fs.readFile)


function getLogs() {
    return ipcMain.on('pkg:getlogs', async (event, fileName) => {
        const logPath = path.join(BASE_DIR, fileName)
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
    const appendLogs = (logs: string, logPath: string): void => {
        fs.appendFile(logPath, logs, {encoding: 'utf-8'}, (err) => {
            if (err) throw err;
        });
    }
    const executeShell = (command: string, logPath: string): void => {
        const child = spawn(command, { shell: true })
        child.stdout.on('data', async (data) => {
            appendLogs(data.toString(), logPath)
        })
        child.stderr.on('data', async (data) => {
            appendLogs(data.toString(), logPath)
        })

    }
    ipcMain.on('pkg:install', (event, data) => {
        const pkgs = data.pkgs
        const logPath = path.join(BASE_DIR, data.fileName)
        let commandElevated = ''
        let commandNormal = 'powershell.exe '
        const platform = process.platform;
        const elevatedPkgs = []
        for (const pkg of pkgs) {
            if (CMD[pkg].elevate) {
                elevatedPkgs.push(pkg)
                commandElevated += CMD[pkg].install[platform] + '; '
            } else {
                commandNormal += CMD[pkg].install[platform] + '; '
            }
        }
        if (commandElevated != '') {
            elevatedShell({ command: commandElevated, path: logPath },
                async (error?: Error, data?: string | Buffer) => {
                    if (data.toString() === 'refreshenv') {
                        for (const pkg of elevatedPkgs) {
                            if (!(process.env.Path.includes(CMD[pkg].path[platform]))) {
                                process.env.Path += CMD[pkg].path[platform]
                            }
                            checkInstalled(pkg, (installed) => {
                                event.reply('pkg:check', { installed: installed, pkg: pkg })
                            })
                        }
                        // executeShell(commandNormal, logPath)
                    }
                })
        } else {
            // executeShell(commandNormal, logPath)
        }

    })
}

function pkgAPI(): void {
    getLogs()
    check()
    pkgInstall()
}

export default pkgAPI


