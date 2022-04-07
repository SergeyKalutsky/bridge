import { shell, checkInstalled } from '../../pkg_manager'
import { ipcMain } from 'electron';
import { BASE_DIR } from './storage';
import path from 'path'
import util from 'util'
import fs from 'fs'

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
    ipcMain.on('pkg:install', (event, data) => {
        const pkgs = data.pkgs
        const logPath = path.join(BASE_DIR, data.fileName)
        let commandElevated = ''
        let commandNormal = ''
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
            shell({ command: commandElevated, path: logPath, elevate: true },
                async (error?: Error, data?: string | Buffer) => {
                    if (data.toString() === 'refreshenv') {
                        for (const pkg of elevatedPkgs) {
                            if (!(process.env.Path.includes(CMD[pkg].path[platform]))) {
                                process.env.Path += CMD[pkg].path[platform]
                            }
                        }
                        shell({ command: commandNormal, path: logPath, elevate: false }, (error, data) => {
                            for (const pkg of pkgs) {
                                checkInstalled(pkg, (installed) => {
                                    event.reply('pkg:check', { installed: installed, pkg: pkg })
                                })
                            }
                        })
                    }
                })
        } else {
            shell({ command: commandNormal, path: logPath, elevate: false }, (error, data) => {
                for (const pkg of pkgs) {
                    checkInstalled(pkg, (installed) => {
                        event.reply('pkg:check', { installed: installed, pkg: pkg })
                    })
                }
            })
        }

    })
}

function pkgAPI(): void {
    getLogs()
    check()
    pkgInstall()
}

export default pkgAPI


