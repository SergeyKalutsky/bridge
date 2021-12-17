import { app, BrowserWindow, ipcMain, session } from 'electron';
import parseGitDiff from './lib/git_api/parse'
import walkSync from './lib/api/dirFiles'
import { git } from './lib/git_api/index'
import util from 'util'
import path from 'path'
import fs from 'fs'

const storage = require('electron-json-storage')

const readFileAsync = util.promisify(fs.readFile)
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
let settings = storage.getSync('settings')
const BASE_DIR = storage.getDataPath()

// Projects ===========================================================
ipcMain.on('projects:mkbasedir', (event, arg) => {
  const filePath = path.join(BASE_DIR, arg.user.login)
  fs.mkdirSync(filePath, { recursive: true })
})

ipcMain.on('projects:getlocalprojectsnames', (event) => {
  const filePath = path.join(BASE_DIR, settings.user.login)
  event.returnValue = fs.readdirSync(filePath)
})

ipcMain.on('projects:delete', (event, project_name) => {
  const filePath = path.join(BASE_DIR, settings.user.login, project_name.replace(/ /g, '-'))
  fs.rmdirSync(filePath, { recursive: true });
})

ipcMain.on('projects:writeactivefile', (event, data) => {
  fs.writeFile(data.filepath, data.fileContent, (err) => {
    if (err) return console.log(err);
  })
})

ipcMain.on('projects:createfolder', (event, data) => {
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

ipcMain.on('projects:createfile', (event, data) => {
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

ipcMain.handle('projects:readactivefile', async (event, filepath) => {
  if (filepath === '') {
    return ''
  } else {
    const fileContent = await readFileAsync(filepath, 'utf-8')
    return fileContent
  }
})

ipcMain.handle('projects:listfiles', async (event) => {
  const project_name = settings.active_project.name.replace(/ /g, '-')
  const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
  const result = walkSync(project_dir)
  return result
})

// GIT ---------------------------------------------------------------
ipcMain.on('git:clone', (event, project) => {
  const project_name = project.name.replace(/ /g, '-')
  const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
  if (!fs.existsSync(project_dir)) {
    git.cwd(path.join(BASE_DIR, settings.user.login)).clone(project.http)
  }
})

ipcMain.on('git:log', (event) => {
  const project_name = settings.active_project.name.replace(/ /g, '-')
  const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
  git.cwd(project_dir).log().then(result => {
    event.returnValue = result['all']
  })
    .catch(err => { event.returnValue = []; console.log(err) })
})

ipcMain.on('git:pull', () => {
  const project_name = settings.active_project.name.replace(/ /g, '-')
  const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
  git.cwd(project_dir).pull()
})

ipcMain.on('git:push', () => {
  const project_name = settings.active_project.name.replace(/ /g, '-')
  const project_dir = path.join(BASE_DIR, settings.user.login, project_name)
  git.cwd(project_dir).add('./*').commit('test').push()
})


ipcMain.on('git:diff', (event, hash) => {
  git.show(hash)
    .then(result => {
      event.returnValue = parseGitDiff(result)
    })
    .catch(err => {
      event.returnValue = undefined
    });
})

ipcMain.on('git:diff', (event, hash) => {
  git.show(hash)
    .then(result => {
      event.returnValue = parseGitDiff(result)
    })
    .catch(err => {
      event.returnValue = undefined
    });
})



// User Settings -------------------------------------------------------------------
ipcMain.on('settings:get', (event) => {
  event.returnValue = settings
})

ipcMain.handle('settings:set', (event, new_settings) => {
  settings = { ...settings, ...new_settings }
  storage.set('settings', settings)
})

// Usual Stuff ---------------------------------------------------------------------
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1200,
    width: 1500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }


  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["script-src 'self' 'unsafe-eval'; object-src 'self'"]
      }
    })
  })

};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
