import { join } from 'path'
import fs from 'fs'
const storage = require('electron-json-storage')

type Project = {
    id: number
    name: string
    isclassroom: number
    islocal: boolean
    http: string
}


const makeBaseDir = (): string => {
    const settings = storage.getSync('settings')
    if ('user' in settings) {
        const basedir = join(storage.getDataPath(), settings.user.login)
        return basedir
    }
    return storage.getDataPath()
}

const mapLocalProject = (project: Project): Project => {
    // const basedir = ipcRenderer.sendSync('projects', { cmd: 'getbasedir' })
    // const files: string[] | Buffer[] | fs.Dirent[] = fs.readdirSync(basedir)
    // if (files.includes(project.name)) {
    //     project.islocal = true
    //     return project
    // }
    project.islocal = false
    return project
}


export { makeBaseDir, mapLocalProject }