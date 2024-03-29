import { ipcMain, shell } from 'electron';
import { store, BASE_DIR, getProjectDir } from './storage'
import { FileObject } from '../../components/Editor/types';
import git from 'isomorphic-git'
import util from 'util'
import path from 'path'
import fs from 'fs'
import ncp from 'ncp'
import { templates } from './templates';


const fsPromises = fs.promises;
const readFileAsync = util.promisify(fs.readFile)
const ncpPromise = util.promisify(ncp)

const walkIgnore = [
    '.git',
    '__pycache__',
    '.DS_Store'
]

async function walkAsync(dir: string): Promise<FileObject[]> {
    const folderFiles = []
    const files = await fsPromises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
        if (walkIgnore.includes(file.name)) { continue }
        if (file.isDirectory()) {
            folderFiles.push({
                name: file.name,
                files: await walkAsync(path.join(dir, file.name)),
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


function loadimagebase64() {
    return ipcMain.handle('projects:loadimagebase64', async (event, filepath) => {
        return await readFileAsync(filepath, { encoding: 'base64' });
    })
}


function mkbasedir() {
    return ipcMain.on('projects:mkbasedir', (event, arg) => {
        const filePath = path.join(BASE_DIR, arg.user.login)
        fs.mkdirSync(filePath, { recursive: true })
    })
}


function openSystemFolder() {
    return ipcMain.on('projects:opensystemfolder', (event) => {
        shell.openPath(getProjectDir())
    })
}


function mkprojectdir() {
    return ipcMain.on('projects:mkprojectdir', (event, project_name) => {
        fs.mkdirSync(getProjectDir(project_name), { recursive: true })
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
    return ipcMain.on('projects:deletetreeelement', async (event, activePath) => {
        // We need to remove(add) files from git after deleting
        // since its a isomorphic git, it won't be able to add file to staging
        // unless we use remove, git.add(..., '.') can only add existing files
        if (activePath.isDirectory) {
            fs.rmSync(activePath.path, { recursive: true });
        } else {
            fs.unlinkSync(activePath.path)
            const relFilePath = activePath.path.replace(getProjectDir() + '/', '')
        }
    })
}

function rename() {
    return ipcMain.handle('projects:rename', async (event, { newName, activePath }) => {
        const oldPath = getProjectDir()
        const newPath = path.join(path.parse(oldPath).dir, newName)
        if (activePath) {
            activePath.path = path.join(newPath, activePath.path.replace(oldPath, ''))
        }
        fs.renameSync(oldPath, newPath);
        return activePath
    })
}


function renameFile() {
    return ipcMain.on('projects:renamefile', (event, data) => {
        const newPath = path.join(path.parse(data.activePath.path).dir, data.newName)
        fs.renameSync(data.activePath.path, newPath);
        store.set('userProjects.activeProject.activePath', { path: newPath, isDirectory: data.activePath.isDirectory })
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
        let folderPath: string
        if (data.activePath === undefined) {
            const project_dir = getProjectDir()
            folderPath = path.join(project_dir, data.name)
        } else if (data.activePath.isDirectory) {
            folderPath = path.join(data.activePath.path, data.name)
        } else {
            folderPath = path.join(path.dirname(data.activePath.path), data.name)
        }
        fs.mkdirSync(folderPath)
        return folderPath
    })
}


function getFileBasename() {
    return ipcMain.on('projects:getfilebasename', (event, { filepath }) => {
        event.returnValue = path.basename(filepath)
    })
}

function getDirName() {
    return ipcMain.on('projects:getdirname', (event, { filepath }) => {
        event.returnValue = path.dirname(filepath)
    })
}

function createFile() {
    return ipcMain.handle('projects:createfile', (event, data) => {
        let filePath: string
        if (data.activePath === undefined) {
            const project_dir = getProjectDir()
            filePath = path.join(project_dir, data.name)
        } else if (data.activePath.isDirectory) {
            filePath = path.join(data.activePath.path, data.name)
        } else {
            filePath = path.join(path.dirname(data.activePath.path), data.name)
        }
        fs.closeSync(fs.openSync(filePath, 'w'))
        return filePath
    })
}


function getProjectTemplates() {
    return ipcMain.handle('projects:getprojecttemplates', async (event, query) => {
        const queryTemplates = []
        for (const template of templates) {
            if (template.name.toLowerCase().includes(query) && query.length > 0) {
                queryTemplates.push(template)
            }
        }
        return queryTemplates
    })

}

function readActiveFile() {
    return ipcMain.handle('projects:readactivefile', async (event, filepath) => {
        return await readFileAsync(filepath, 'utf-8')
    })
}

function getFolderFiles() {
    return ipcMain.on('projects:getfolderfiles', (event, { directoryPath }) => {
        event.returnValue = fs.readdirSync(directoryPath, { withFileTypes: true }).map(item => item.name)
    })
}


function listFiles() {
    return ipcMain.handle('projects:listfiles', async (event) => {
        const project_dir = getProjectDir()
        const files = {
            name: store.get('userProjects.activeProject.name'),
            isDirectory: true,
            path: project_dir,
            files: await walkAsync(project_dir)
        }
        return [files]
    })
}

function copyFile() {
    return ipcMain.handle('projects:copyfile', async (event, arg) => {
        if (arg.root) {
            arg.destination = getProjectDir()
        }
        arg.destination = path.join(arg.destination, path.parse(arg.src).base)
        await ncpPromise(arg.src, arg.destination)
    })
}

function projectAPI(): void {
    getFolderFiles()
    getDirName()
    getFileBasename()
    openSystemFolder()
    getProjectTemplates()
    loadimagebase64()
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
    rename()
}

export default projectAPI





