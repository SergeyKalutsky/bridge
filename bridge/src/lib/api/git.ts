import { store, BASE_DIR, getProjectDir } from './storage'
import { ipcMain } from 'electron';
import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'

const author = { name: 'SergeyKalutsky', email: 'skalutsky@gmail.com' }

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


function cleanEmptyFoldersRecursively(folder) {
  const isDir = fs.statSync(folder).isDirectory();
  if (!isDir) {
    return;
  }
  let files = fs.readdirSync(folder);
  if (files.length > 0) {
    files.forEach(function (file) {
      const fullPath = path.join(folder, file);
      cleanEmptyFoldersRecursively(fullPath);
    });

    // re-evaluate files; after deleting subfolder
    // we may have parent folder empty now
    files = fs.readdirSync(folder);
  }
  if (files.length == 0) {
    console.log("removing: ", folder);
    fs.rmdirSync(folder);
    return;
  }
}


const getFileChanges = async (oid: string, oid_prev: string) => {
  const imgExt = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp']
  const A = git.TREE({ ref: oid })
  const B = git.TREE({ ref: oid_prev })
  // Get a list of the files that changed
  const fileChanges = [];
  await git.walk({
    fs: fs,
    dir: getProjectDir(),
    trees: [A, B],
    map: async function (filename, [A, B]) {
      if (A === null || await A.type() === 'tree') return
      const arr = filename.split('.')
      const ext = arr[arr.length - 1]

      if (imgExt.includes(ext)) {
        fileChanges.push({
          filename: filename,
          newFile: 'raw bytes++',
          oldFile: ''
        })
        return
      }

      if (B === null) {
        fileChanges.push({
          filename: filename,
          newFile: Utf8ArrayToStr(await A.content()),
          oldFile: ''
        })
        return
      }
      if (await A.oid() === await B.oid()) return

      fileChanges.push({
        filename: filename,
        newFile: Utf8ArrayToStr(await A.content()),
        oldFile: Utf8ArrayToStr(await B.content())
      })

    }
  })
  return fileChanges
}


const revertChanges = async (oid: string, oid_revert: string, dir: string) => {
  console.log({ 'A': oid, 'B': oid_revert })
  const A = git.TREE({ ref: oid })
  const B = git.TREE({ ref: oid_revert })
  await git.walk({
    fs: fs,
    dir: dir,
    trees: [A, B],
    map: async function (filename, [A, B]) {

      const filePath = path.join(dir, filename)
      const dirPath = path.dirname(filePath)
      // If file is now deleted we recreate path(all folders) recursively
      // and populate file with old content
      if (A === null) {
        const oldContent = Utf8ArrayToStr(await B.content())
        if (!fs.existsSync(dirPath)) {
          fs.mkdir(dirPath, { recursive: true }, async (err) => {
            if (err) throw err;
          });
        }
        fs.writeFile(filePath, oldContent, 'utf8', function (err) {
          if (err) throw err;
        });
        return
      }

      if (await A.type() === 'tree') return
      // if the file didn't exist or was deleted we do the same
      if (B === null) {
        if (!fs.existsSync(filePath)) return
        fs.unlinkSync(filePath);
        // since add in isomorphic git cant track removed files,
        // we remove the file manually
        await git.remove({ fs, dir: getProjectDir(), filepath: filename })
        return
      }
      if (await A.oid() === await B.oid()) return
      const oldContent = Utf8ArrayToStr(await B.content())
      fs.writeFile(filePath, oldContent, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    }
  })
  // clean up all remaining empty folders recursively
  cleanEmptyFoldersRecursively(dir)
}


function clone() {
  return ipcMain.on('git:clone', async (event, { repo, git_url }) => {
    await git.clone({
      fs, http, dir: path.join(BASE_DIR, store.get('user.login'), repo),
      url: git_url
    }).then(console.log)
    event.reply('git:clone', { msg: 'cloned' })
  })
}


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


function commit() {
  return ipcMain.handle('git:commit', async () => {
    await git.add({ fs, dir: getProjectDir(), filepath: '.' })
    await git.commit({ fs, dir: getProjectDir(), message: 'test', author })
  })
}


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

function revert() {
  return ipcMain.handle('git:revert', async (event, args) => {
    await revertChanges(args.oid, args.oid_prev, getProjectDir())
    await git.add({ fs, dir: getProjectDir(), filepath: '.' })
    await git.commit({ fs, dir: getProjectDir(), message: 'revert', author })
  })
}

function diff() {
  return ipcMain.on('git:diff', async (event, args) => {
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