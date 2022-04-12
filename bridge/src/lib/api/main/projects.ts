import { ipcMain } from 'electron';
import { store, BASE_DIR } from './storage'
import util from 'util'
import path from 'path'
import fs from 'fs'
import ncp from 'ncp'

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

function mkprojectdir() {
    return ipcMain.on('projects:mkprojectdir', (event, project_name) => {
        const filePath = path.join(BASE_DIR, store.get('user.login'), project_name)
        fs.mkdirSync(filePath, { recursive: true })
    })
}

function getlocalprojectsnames() {
    return ipcMain.on('projects:getlocalprojectsnames', (event) => {
        const filePath = path.join(BASE_DIR, store.get('user.login'))
        event.returnValue = fs.readdirSync(filePath)
    })
}

function deleteProject() {
    return ipcMain.on('projects:delete', (event, project_name) => {
        const filePath = path.join(BASE_DIR,
            store.get('user.login'),
            project_name.replace(/ /g, '-'))
        fs.rmSync(filePath, { recursive: true })
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

function renameFile() {
    return ipcMain.on('projects:renamefile', (event, data) => {
        const newPath = path.join(path.parse(data.activePath.path).dir, data.newName)
        fs.renameSync(data.activePath.path, newPath);
        event.returnValue = newPath
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
    return ipcMain.handle('projects:createfolder', (event, data) => {
        if (data.activePath === undefined) {
            const project_name = store.get('active_project.name')
            const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
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
}

function createFile() {
    return ipcMain.handle('projects:createfile', (event, data) => {
        if (data.activePath === undefined) {
            const project_name = store.get('active_project.name')
            const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
            const filePath = path.join(project_dir, data.name)
            fs.closeSync(fs.openSync(filePath, 'w'))
            event.returnValue = filePath
        } else if (data.activePath.isDirectory) {
            const filePath = path.join(data.activePath.path, data.name)
            fs.closeSync(fs.openSync(filePath, 'w'))
            event.returnValue = filePath
        } else {
            const filePath = path.join(path.dirname(data.activePath.path), data.name)
            fs.closeSync(fs.openSync(filePath, 'w'))
            event.returnValue = filePath
        }
    })
}

function readActiveFile() {
    return ipcMain.handle('projects:readactivefile', async (event, filepath) => {
        return await readFileAsync(filepath, 'utf-8')
    })

}

function listFiles() {
    return ipcMain.on('projects:listfiles', async (event) => {
        const project_name = store.get('active_project.name')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        const result = walkSync(project_dir)
        event.reply('projects:listfiles', result)
    })
}

function copyFile() {
    return ipcMain.on('projects:copyfile', async (event, arg) => {
        if (arg.root) {
            arg.destination = path.join(BASE_DIR, store.get('user.login'), store.get('active_project.name'))
        }
        arg.destination = path.join(arg.destination, path.parse(arg.src).base)
        ncp(arg.src, arg.destination, (err) => {
            if (err) throw err;
            const project_name = store.get('active_project.name')
            const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
            const result = walkSync(project_dir)
            event.reply('projects:listfiles', result)
        });
    })
}

function projectAPI(): void {
    renameFile()
    copyFile()
    mkbasedir()
    deleteTreeElement()
    writeActiveFile()
    readActiveFile()

    getlocalprojectsnames()
    deleteProject()
    createFolder()
    createFile()
    listFiles()
    mkprojectdir()
}

export default projectAPI





