import { ipcMain } from 'electron';
import { Octokit } from "@octokit/core"
import { store, BASE_DIR, getProjectDir } from './storage'
import { FileObject } from '../../components/Editor/types';
import git from 'isomorphic-git'
import util from 'util'
import path from 'path'
import fs from 'fs'
import ncp from 'ncp'
import glob from 'glob'


const removeFromGit = (dir: string) => {
    const listFiles = function (src, callback) {
        glob(src + '/**/*.*', callback);
    };
    listFiles(dir, async (err, res) => {
        if (err) throw err
        for (const filePath of res) {
            await git.remove({ fs, dir: getProjectDir(), filepath: filePath.replace(getProjectDir() + '/', '') })
        }
    });
}


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

function tokenAccessPermintions() {
    return ipcMain.handle('projects:tokenaccesspermintions', async (event, token) => {
        const octokit = new Octokit({ auth: token });
        try {
            const { data } = await octokit.request("/user");
            const pub = data.public_repos ? data.public_repos : 0
            const priv = data.total_private_repos ? data.total_private_repos : 0
            if (pub + priv > 1) {
                return 'warning'
            }
            return 'warning'
        } catch (httpError) {
            return 'error'
        }
    })
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
    return ipcMain.on('projects:deletetreeelement', async (event, activePath) => {
        // We need to remove(add) files from git after deleting
        // since its a isomorphic git, it won't be able to add file to staging
        // unless we use remove, git.add(..., '.') can only add existing files
        if (activePath.isDirectory) {
            fs.rmSync(activePath.path, { recursive: true });
            removeFromGit(activePath.path)
        } else {
            fs.unlinkSync(activePath.path)
            const relFilePath = activePath.path.replace(getProjectDir() + '/', '')
            console.log(relFilePath)
            await git.remove({ fs, dir: getProjectDir(), filepath: relFilePath })
        }
    })
}

function renameFile() {
    return ipcMain.on('projects:renamefile', (event, data) => {
        const newPath = path.join(path.parse(data.activePath.path).dir, data.newName)
        fs.renameSync(data.activePath.path, newPath);
        store.set('active_project.activePath', { path: newPath, isDirectory: data.activePath.isDirectory })
        git.remove({ fs, dir: getProjectDir(), filepath: data.activePath.path.replace(getProjectDir() + '/', '') })
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
            const project_name = store.get('active_project.name')
            const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
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

function createFile() {
    return ipcMain.handle('projects:createfile', (event, data) => {
        let filePath: string
        if (data.activePath === undefined) {
            const project_name = store.get('active_project.name')
            const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
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

function readActiveFile() {
    return ipcMain.handle('projects:readactivefile', async (event, filepath) => {
        return await readFileAsync(filepath, 'utf-8')
    })

}

function listFiles() {
    return ipcMain.handle('projects:listfiles', async (event) => {
        const project_name = store.get('active_project.name')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        const files = {
            name: project_name,
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
            arg.destination = path.join(BASE_DIR, store.get('user.login'), store.get('active_project.name'))
        }
        arg.destination = path.join(arg.destination, path.parse(arg.src).base)
        await ncpPromise(arg.src, arg.destination)
    })
}

function projectAPI(): void {
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
}

export default projectAPI





