import { app, BrowserWindow, ipcMain, session } from 'electron';
import parseGitDiff from './lib/git_api/parse'
import walkSync from './lib/api/dirFiles'
import { git } from './lib/git_api/index'
import { join } from 'path'
import fs from 'fs'

const storage = require('electron-json-storage')

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
let settings = storage.getSync('settings')
const BASE_DIR = storage.getDataPath()

// Projects ===========================================================
ipcMain.on('projects:mkbasedir', (event, arg) => {
  const path = join(BASE_DIR, arg.user.login)
  fs.mkdirSync(path, { recursive: true })
})

ipcMain.on('projects:getlocalprojectsnames', (event) => {
  const path = join(BASE_DIR, settings.user.login)
  event.returnValue = fs.readdirSync(path)
})

ipcMain.on('projects:delete', (event, project_name) => {
  const path = join(BASE_DIR, settings.user.login, project_name.replace(/ /g, '-'))
  fs.rmdirSync(path, { recursive: true });
})

ipcMain.on('projects:setactivefile', (event, filepath) => {
  if (filepath === '') {
    event.returnValue = ''
  } else {
    event.returnValue = fs.readFileSync(filepath, { 'encoding': 'utf-8' })
  }
})


ipcMain.handle('projects:listfiles', async (event) => {
  const project_name = settings.active_project.name.replace(/ /g, '-')
  const project_dir = join(BASE_DIR, settings.user.login, project_name)
  const result = walkSync(project_dir)
  return result
})

// GIT ---------------------------------------------------------------
ipcMain.on('git:clone', (event, project) => {
  const project_name = project.name.replace(/ /g, '-')
  const project_dir = join(BASE_DIR, settings.user.login, project_name)
  if (!fs.existsSync(project_dir)) {
    git.cwd(join(BASE_DIR, settings.user.login)).clone(project.http)
  }
})

ipcMain.on('git:log', (event) => {
  const project_name = settings.active_project.name.replace(/ /g, '-')
  const project_dir = join(BASE_DIR, settings.user.login, project_name)
  git.cwd(project_dir).log().then(result => {
    event.returnValue = result['all']
  })
    .catch(err => { event.returnValue = []; console.log(err) })
})

ipcMain.on('git:pull', () => {
  const project_name = settings.active_project.name.replace(/ /g, '-')
  const project_dir = join(BASE_DIR, settings.user.login, project_name)
  git.cwd(project_dir).pull()
})

ipcMain.on('git:push', () => {
  const project_name = settings.active_project.name.replace(/ /g, '-')
  const project_dir = join(BASE_DIR, settings.user.login, project_name)
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
