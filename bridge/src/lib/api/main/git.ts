import { ipcMain } from 'electron';
import { store, BASE_DIR } from './storage'
import { git, parseGitDiff } from '../../simple_git'
import path from 'path'
import fs from 'fs'



function clone() {
    return ipcMain.on('git:clone', (event, project) => {
        const project_name = project.name.replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        if (!fs.existsSync(project_dir)) {
            git.cwd(path.join(BASE_DIR, store.get('user.login'))).clone(project.http, project_name)
        }
    })
}

function log() {
    return ipcMain.on('git:log', (event) => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        git.cwd(project_dir).log().then(result => {
            event.returnValue = result['all']
        })
            .catch(err => { event.returnValue = []; console.log(err) })
    })
}

function pull() {
    return ipcMain.on('git:pull', () => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        git.cwd(project_dir).pull()
    })
}

function push() {
    return ipcMain.on('git:push', () => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        git.cwd(project_dir).add('./*').commit('test').push()
    })
}

function diff() {
    return ipcMain.on('git:diff', (event, hash) => {
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
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        git.cwd(project_dir).init()
    })
}


function gitAPI(): void {
    clone()
    log()
    pull()
    push()
    diff()
    init()
}

export default gitAPI