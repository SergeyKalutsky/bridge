import { ipcMain } from 'electron';
import util from 'util'
import path from 'path'
import fs from 'fs'
import { Settings } from 'src/types';

const storage = require('electron-json-storage')

const BASE_DIR = storage.getDataPath()
const readFileAsync = util.promisify(fs.readFile)

interface FileObject {
    name: string
    files?: string[]
    path: string
    isDirectory: boolean
}

function walkSync(dir: string): FileObject[] {
    const folderFiles = []
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.name === '.git') { continue }
        if (file.isDirectory()) {
            folderFiles.push({
                name: file.name,
                files: walkSync(path.join(dir, file.name)),
                isDirectory: true,
                path: path.join(dir, file.name)
            })
        } else {
            folderFiles.push({
                name: file.name,
                isDirectory: false,
                path: path.join(dir, file.name)
            })
        }
    }
    return folderFiles
}


function mkbasedir() {
    return ipcMain.on('projects:mkbasedir', (event, arg) => {
        const filePath = path.join(BASE_DIR, arg.user.login)
        fs.mkdirSync(filePath, { recursive: true })
    })
}

function getlocalprojectsnames() {
    return ipcMain.on('projects:getlocalprojectsnames', (event) => {
        storage.get('settings', function (error: Error, settings: Settings) {
            const filePath = path.join(BASE_DIR, settings.user.login)
            event.returnValue = fs.readdirSync(filePath)
        });
    })
}

function deleteProject() {
    return ipcMain.on('projects:delete', (event, project_name) => {
        storage.get('settings', function (error: Error, settings: Settings) {
            const filePath = path.join(BASE_DIR,
                settings.user.login,
                project_name.replace(/ /g, '-'))
            fs.rmSync(filePath, { recursive: true })
        })
    })
}

function deleteTreeElement() {
    return ipcMain.on('projects:deletetreeelement', (event, activePath) => {
        if (activePath.isDirectory) {
            fs.rmSync(activePath.path, { recursive: true });
        } else {
            fs.unlinkSync(activePath.path)
        }
    })
}

function writeActiveFile() {
    return ipcMain.on('projects:writeactivefile', (event, data) => {
        fs.writeFile(data.filepath, data.fileContent, (err) => {
            if (err) return console.log(err);
        })
    })
}

function createFolder() {
    return ipcMain.on('projects:createfolder', (event, data) => {
        storage.get('settings', function (error: Error, settings: Settings) {
            if (data.activePath === null) {
                const project_name = settings.active_project.name.replace(/ /g, '-')
                const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
                const folderPath = path.join(project_dir, data.name)
                fs.mkdirSync(folderPath)
            } else if (data.activePath.isDirectory) {
                const folderPath = path.join(data.activePath.path, data.name)
                fs.mkdirSync(folderPath)
            } else {
                const folderPath = path.join(path.dirname(data.activePath.path), data.name)
                fs.mkdirSync(folderPath)
            }
        })
    })

}

function createFile() {
    return ipcMain.on('projects:createfile', (event, data) => {
        storage.get('settings', function (error: Error, settings: Settings) {
            if (data.activePath === null) {
                const project_name = settings.active_project.name.replace(/ /g, '-')
                const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
                const filePath = path.join(project_dir, data.name)
                fs.closeSync(fs.openSync(filePath, 'w'))
            } else if (data.activePath.isDirectory) {
                const filePath = path.join(data.activePath.path, data.name)
                fs.closeSync(fs.openSync(filePath, 'w'))
            } else {
                const filePath = path.join(path.dirname(data.activePath.path), data.name)
                fs.closeSync(fs.openSync(filePath, 'w'))
            }
        })
    })
}

function readActiveFile() {
    return ipcMain.handle('projects:readactivefile', async (event, filepath) => {
        if (filepath === '') {
            return ''
        } else {
            const fileContent = await readFileAsync(filepath, 'utf-8')
            return fileContent
        }
    })

}

function listFiles() {
    return ipcMain.handle('projects:listfiles', async (event) => {
        const settings = storage.getSync('settings')
        storage.get('settings', function (error: Error, settings: Settings) {
            const project_name = settings.active_project.name.replace(/ /g, '-')
            const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
            const result = walkSync(project_dir)
            return result
        })
    })
}

function registerProjectAPI() {
    mkbasedir()
    getlocalprojectsnames()
    deleteProject()
    deleteTreeElement()
    writeActiveFile()
    createFolder()
    createFile()
    readActiveFile()
    listFiles()
}

export default registerProjectAPI





