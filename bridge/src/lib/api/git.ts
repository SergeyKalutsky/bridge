/* eslint-disable import/no-named-as-default-member */
import { store, BASE_DIR, getProjectDir } from './storage'
import * as gitHubApi from './gitHubApi'
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


function checkoutBranch() {
  return ipcMain.handle('git:checkoutbranch', async (event, { branch }) => {
    await git.checkout({
      fs,
      dir: getProjectDir(),
      ref: branch
    })
  })
}


function status() {
  return ipcMain.handle('git:status', async (event) => {
    const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3

    const statusMapping = {
      "003": "added, staged, deleted unstaged",
      "020": "new, untracked",
      "022": "added, staged",
      "023": "added, staged, with unstaged changes",
      "100": "deleted, staged",
      "101": "deleted, unstaged",
      "103": "modified, staged, deleted unstaged",
      "111": "unmodified",
      "121": "modified, unstaged",
      "122": "modified, staged",
      "123": "modified, staged, with unstaged changes"
    };
    const dir = getProjectDir()
    const statusMatrix = (await git.statusMatrix({ fs, dir }))
      .filter(row => row[HEAD] !== row[WORKDIR] || row[HEAD] !== row[STAGE])

    return statusMatrix.map(row => statusMapping[row.slice(1).join("")] + ": " + row[FILE])
  })
}



function addGitHubRemote() {
  return ipcMain.on('git:pushremote', async (event, { token, repo, url }) => {
    const dir = getProjectDir(repo)
    const errorName = await gitHubApi.pushRemote({ token, dir, url })
    if (errorName === 'UrlParseError') {
      const msg = 'GitHub URL неправильный'
      event.reply('git:pushremote', { type: 'error', msg: msg })
      return
    }
    if (errorName === 'BadToken') {
      const msg = 'Токен не существует или его срок действия истек'
      event.reply('git:pushremote', { type: 'error', msg: msg })
      return
    }
    if (errorName === 'PushRejectedError') {
      const msg = 'Push отклонен. Скорее всего удаленное репо не пустое. Удалите и создайте его снова.'
      event.reply('git:pushremote', { type: 'error', msg: msg })
      return
    }
    if (errorName === 'NotFound') {
      const msg = 'Удаленный GitHub репо не найден.'
      event.reply('git:pushremote', { type: 'error', msg: msg })
      return
    }
    if (errorName === 'Forbidden') {
      const msg = 'У токена недостаточно прав для доступа к удаленному репо'
      event.reply('git:pushremote', { type: 'error', msg: msg })
      return
    }
    event.reply('git:pushremote', { type: 'success', msg: '' })
  })
}

function testGitHubToken() {
  return ipcMain.on('git:testtoken', async (event, { token, repo, git_url }) => {
    const dir = getProjectDir(repo)
    const success = await gitHubApi.pushTestBranch({ token, dir, git_url })
    console.log(success)
    if (success) {
      event.reply('git:testtoken', { type: 'success', msg: '' })
      return
    }
    event.reply('git:testtoken', { type: 'error', msg: 'Не удалось добавить токен.' })
  })
}


function getCurrentBranch() {
  return ipcMain.handle('git:getcurrentbranch', async () => {
    return await git.currentBranch({ fs, dir: getProjectDir(), fullname: false })
  })
}

function listBranches() {
  return ipcMain.handle('git:listbranches', async () => {
    return await git.listBranches({ fs, dir: getProjectDir() })
  })
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


function headPositonLocal() {
  return ipcMain.handle('git:headpositionlocal', async (event, { branch, url }: { branch: string, url: string }) => {
    return await gitHubApi.headPositonLocal(branch, url, getProjectDir())
  })
}

function pull() {
  return ipcMain.handle('git:pull', async (event, branch) => {
    await gitHubApi.pullForce({
      dir: getProjectDir(),
      branch,
      url: store.get('userProjects.activeProject.http'),
      author
    })
  })
}


function commit() {
  return ipcMain.handle('git:commit', async () => {
    await git.add({ fs, dir: getProjectDir(), filepath: '.' })
    await git.commit({ fs, dir: getProjectDir(), message: 'test', author })
  })
}


function push() {
  return ipcMain.handle('git:push', async (event, { branch, force }) => {
    const res = await git.push({
      fs,
      http,
      dir: getProjectDir(),
      url: store.get('userProjects.activeProject.http'),
      ref: branch,
      force: force,
      onAuth: () => ({ username: 'SergeyKalutsky', password: store.get('userProjects.activeProject.token') }),
    })
    console.log(res)
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
  headPositonLocal()
  testGitHubToken()
  addGitHubRemote()
  status()
  checkoutBranch()
  listBranches()
  getCurrentBranch()
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