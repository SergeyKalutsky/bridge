import { ipcMain } from 'electron';
import { Settings } from '../../../types';
import { git, parseGitDiff } from '../../simple_git'
import path from 'path'
import fs from 'fs'

const storage = require('electron-json-storage')
const BASE_DIR = storage.getDataPath()


function clone() {
    return ipcMain.on('git:clone', (event, project) => {
        storage.get('settings', function (error: Error, settings: Settings) {
            const project_name = project.name.replace(/ /g, '-')
            const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
            if (!fs.existsSync(project_dir)) {
                git.cwd(path.join(BASE_DIR, settings.user.login)).clone(project.http)
            }
        })
    })
}

function log() {
    return ipcMain.on('git:log', (event) => {
        storage.get('settings', function (error: Error, settings: Settings) {
            const project_name = settings.active_project.name.replace(/ /g, '-')
            const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
            git.cwd(project_dir).log().then(result => {
                event.returnValue = result['all']
            })
                .catch(err => { event.returnValue = []; console.log(err) })
        })
    })
}

function pull() {
    return ipcMain.on('git:pull', () => {
        storage.get('settings', function (error: Error, settings: Settings) {
            const project_name = settings.active_project.name.replace(/ /g, '-')
            const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
            git.cwd(project_dir).pull()
        })
    })
}

function push() {
    return ipcMain.on('git:push', () => {
        storage.get('settings', function (error: Error, settings: Settings) {
            const project_name = settings.active_project.name.replace(/ /g, '-')
            const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
            git.cwd(project_dir).add('./*').commit('test').push()
        })
    })
}

function diff() {
    return ipcMain.on('git:init', (event, hash) => {
        git.show(hash)
            .then(result => {
                event.returnValue = parseGitDiff(result)
            })
            .catch(err => {
                event.returnValue = undefined
            });
    })

}

function init() {
    return ipcMain.on('git:init', (event, project_name) => {
        storage.get('settings', function (error: Error, settings: Settings) {
            const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
            git.cwd(project_dir).init()
        })
    })

}


function registerGitAPI(): void {
    clone()
    log()
    pull()
    push()
    diff()
    init()
}

export default registerGitAPI