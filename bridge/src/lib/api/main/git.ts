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

  const A = git.TREE({ ref: oid })
  const B = git.TREE({ ref: oid_prev })
  // Get a list of the files that changed
  const fileChanges = [];
  await git.walk({
    fs: fs,
    dir: getProjectDir(),
    trees: [A, B],
    map: async function (filename, [A, B]) {

      if (await A.type() === 'tree') return

      const Aoid = await A.oid();
      const Boid = await B.oid();
      const Auint8array = await A.content()
      const Buint8array = await B.content()

      // Skip pairs where the oids are the same
      if (Aoid === Boid) return

      fileChanges.push({
        filename: filename,
        newFile: Utf8ArrayToStr(Auint8array),
        oldFile: Utf8ArrayToStr(Buint8array)
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


// function revert() {
//   // git revert 8394daf.. --no-edit --no-commit 
//   // to revert to a specific commit we use hash[:8].. that will revert all commit changes
//   // prior to the commit indicated by hash
//   // to avoid editing commit msg we path --no-edit
//   // to avoid commiting every reversion of the commit(it can be too large) we pass --no-commit
//   return ipcMain.handle('git:revert', async (event, hash: string) => {
//     const git = formGit()
//     await git.raw(['revert', hash.substring(0, 7) + '..', '--no-edit', '--no-commit'])
//     await git.add('./*').commit('revert')
//   })
// }

function diff() {
  return ipcMain.on('git:diff', async (event, args) => {
    console.log(args)
    const res = await getFileChanges(args.oid, args.oid_prev)
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