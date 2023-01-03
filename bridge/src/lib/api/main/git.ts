import { store, BASE_DIR } from './storage'
import { ipcMain } from 'electron';
import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'

const author = { name: 'SergeyKalutsky', email: 'skalutsky@gmail.com' }

function getProjectDir(): string {
  return path.join(BASE_DIR, store.get('user.login'), store.get('active_project.name'))
}

function Utf8ArrayToStr(array) {
  let out, i, c;
  let char2, char3;


  out = "";
  const len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}

const getFileChanges = async (oid: string, oid_prev: string) => {
  console.log(getProjectDir())
  const A = git.TREE({ ref: oid })
  const B = git.TREE({ ref: oid_prev })
  console.log('here', A, B, oid, oid_prev)
  // Get a list of the files that changed
  const fileChanges = [];
  await git.walk({
    fs: fs,
    dir: getProjectDir(),
    trees: [A, B],
    map: async function (filename, [A, B]) {
      if (A === null || await A.type() === 'tree') return

      if (B === null) {
        fileChanges.push({
          filename: filename,
          newFile: Utf8ArrayToStr(await A.content()),
          oldFile: ''
        })
        return
      }

      fileChanges.push({
        filename: filename,
        newFile: Utf8ArrayToStr(await A.content()),
        oldFile: Utf8ArrayToStr(await B.content())
      })

    }
  })
  return fileChanges
}

// done
function clone() {
  return ipcMain.handle('git:clone', async (event, project) => {
    const dir = getProjectDir()
    await git.clone({
      fs, http,
      dir: path.join(BASE_DIR, store.get('user.login'), project.name),
      url: project.http
    }).then(console.log)
  })
}
// done (sort of need to replase hash with oid later)
function log() {
  return ipcMain.on('git:log', async (event) => {
    const commits = await git.log({ fs, dir: getProjectDir() })
    const oids = commits.map(commit => commit.oid)
    event.returnValue = oids
  })
}

function pull() {
  return ipcMain.handle('git:pull', async () => {
    await git.pull({ fs, http, dir: getProjectDir(), author }).then(console.log)
  })
}

// done
function commit() {
  return ipcMain.handle('git:commit', async () => {
    await git.add({ fs, dir: getProjectDir(), filepath: '.' })
    await git.commit({ fs, dir: getProjectDir(), message: 'test', author })
  })
}
// done
function push() {
  return ipcMain.on('git:push', async () => {
    await git.push({
      fs,
      http,
      dir: getProjectDir(),
      remote: 'origin',
      ref: 'master',
      onAuth: () => ({ username: 'SergeyKalutsky', password: '' }),
    })
  })
}

function diff() {
  return ipcMain.on('git:diff', async (event, args) => {
    console.log(args)
    const res = await getFileChanges(args.oid, args.oid_prev)
    console.log(res)
    event.returnValue = res
  })
}

function init() {
  return ipcMain.on('git:init', async (event, project_name) => {
    await git.init({ fs, dir: path.join(BASE_DIR, store.get('user.login'), project_name) })
  })
}


function gitAPI(): void {
  // revert()
  clone()
  log()
  pull()
  push()
  diff()
  init()
  commit()
}

export default gitAPI