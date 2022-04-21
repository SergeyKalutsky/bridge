import { GitDiff } from "../../../components/git/types"
import simpleGit, { SimpleGit } from 'simple-git';
import { store, BASE_DIR } from './storage'
import { ipcMain } from 'electron';
import path from 'path'
import fs from 'fs'

const parseGitDiff = (diffOutput: string): GitDiff[] => {
  const output: GitDiff[] = []
  const files: string[][] = [[]]
  let fileIndex = 0
  let doPush = false
  for (const line of diffOutput.split(/\r?\n/)) {
    if (line.substring(0, 4) === 'diff' && doPush) {
      fileIndex++
      files.push([])
      files[fileIndex].push(line)

    } else if (line.substring(0, 4) === 'diff') {
      files[fileIndex].push(line)
      doPush = true

    } else if (doPush) {
      files[fileIndex].push(line)
    }
  }
  for (const file of files) {
    const filename = file[0].split(/\r? /).slice(-1)[0].slice(1)
    const OldFileList = []
    const NewFileList = []
    for (const line of file.slice(5)) {
      if (line[0] === ' ') {
        OldFileList.push(line.slice(1))
        NewFileList.push(line.slice(1))
      } else if (line[0] === '+') {
        NewFileList.push(line.slice(1))
      } else if (line[0] === '-') {
        OldFileList.push(line.slice(1))
      }
    }
    output.push({
      filename: filename,
      oldFile: OldFileList.join("\r\n"),
      newFile: NewFileList.join("\r\n")
    })
  }
  return output
}



function clone() {
    return ipcMain.on('git:clone', (event, project) => {
        const project_name = project.name.replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        if (!fs.existsSync(project_dir)) {
            const git: SimpleGit = simpleGit(path.join(BASE_DIR, store.get('user.login')), { binary: store.get('pkg.git') });
            git.clone(project.http, project_name)
        }
    })
}

function log() {
    return ipcMain.on('git:log', (event) => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        const git: SimpleGit = simpleGit(project_dir, { binary: store.get('pkg.git') });
        git.log().then(result => {
            event.returnValue = result['all']
        })
            .catch(err => { event.returnValue = []; console.log(err) })
    })
}

function pull() {
    return ipcMain.on('git:pull', () => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        const git: SimpleGit = simpleGit(project_dir, { binary: store.get('pkg.git') });
        git.pull()
    })
}

function commit() {
    return ipcMain.on('git:commit', () => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        const git: SimpleGit = simpleGit(project_dir, { binary: store.get('pkg.git') });
        git.add('./*').commit('test')
    })
}

function push() {
    return ipcMain.on('git:push', () => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        const git: SimpleGit = simpleGit(project_dir, { binary: store.get('pkg.git') });
        git.add('./*').commit('test').push()
    })
}


function revert() {
    return ipcMain.handle('git:revert', async (event, hash: string) => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        const git: SimpleGit = simpleGit(project_dir, { binary: store.get('pkg.git') });
        await git.raw(['checkout', hash, '.'])
        await git.add('./*').commit('test')
    })
}

function diff() {
    return ipcMain.on('git:diff', (event, hash) => {
        const project_name = store.get('active_project.name').replace(/ /g, '-')
        const project_dir = path.join(BASE_DIR, store.get('user.login'), project_name)
        const git: SimpleGit = simpleGit(project_dir, { binary: store.get('pkg.git') });
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
        const git: SimpleGit = simpleGit(project_dir, { binary: store.get('pkg.git') });
        git.init()
    })
}


function gitAPI(): void {
    revert()
    clone()
    log()
    pull()
    push()
    diff()
    init()
    commit()
}

export default gitAPI