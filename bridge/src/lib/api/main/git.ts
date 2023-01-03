import { GitDiff } from "../../../components/git/types"
import simpleGit, { SimpleGit } from 'simple-git';
import { store, BASE_DIR } from './storage'
import { ipcMain } from 'electron';
import path from 'path'

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


function formGit(basedir = false): SimpleGit {
  const projectName = basedir ? '' : store.get('active_project.name')
  const projectDir = path.join(BASE_DIR, store.get('user.login'), projectName)
  const git = simpleGit(projectDir, { binary: store.get('pkg.git') });
  return git
}

// done
function clone() {
  return ipcMain.handle('git:clone', async (event, project) => {
    await formGit(true).clone(project.http, project.name).catch(err => console.log(err))
  })
}
// done (sort of need to replase hash with oid later)
function log() {
  return ipcMain.on('git:log', async (event) => {
    await formGit().log().then(result => {
      event.returnValue = result['all']
    })
      .catch(err => { event.returnValue = []; console.log(err) })
  })
}
// done
function pull() {
  return ipcMain.handle('git:pull', async () => {
    await formGit().pull()
  })
}
// done
function commit() {
  return ipcMain.handle('git:commit', async () => {
    await formGit().add('./*').commit('test')
  })
}
// done
function push() {
  return ipcMain.on('git:push', async () => {
    await formGit().add('./*').commit('test').push()
  })
}


function revert() {
  // git revert 8394daf.. --no-edit --no-commit 
  // to revert to a specific commit we use hash[:8].. that will revert all commit changes
  // prior to the commit indicated by hash
  // to avoid editing commit msg we path --no-edit
  // to avoid commiting every reversion of the commit(it can be too large) we pass --no-commit
  return ipcMain.handle('git:revert', async (event, hash: string) => {
    const git = formGit()
    await git.raw(['revert', hash.substring(0, 7)+'..', '--no-edit', '--no-commit'])
    await git.add('./*').commit('revert')
  })
}

function diff() {
  return ipcMain.on('git:diff', (event, hash) => {
    formGit().show(hash)
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