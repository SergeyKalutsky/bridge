import { app, BrowserWindow, ipcMain, session } from 'electron';
import { makeBaseDir } from './lib/helpers';
import parseGitDiff from './lib/git_api/parse'
import { git } from './lib/git_api/index'
import { join } from 'path'
import fs from 'fs'

const storage = require('electron-json-storage')

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
let BASE_DIR = makeBaseDir()

// Projects ===========================================================
ipcMain.on('projects:mkbasedir', (event, arg) => {
  BASE_DIR = join(BASE_DIR, arg.user.login)
  fs.mkdirSync(BASE_DIR, { recursive: true })
})

ipcMain.on('projects:delete', (event, project) => {
  const dir = join(BASE_DIR, project.name.replace(/ /g, '-'))
  fs.rmdirSync(dir, { recursive: true });
})


// GIT ---------------------------------------------------------------
ipcMain.on('git', (event, arg) => {

  if (arg.project !== undefined) {
    const project_dir = join(BASE_DIR, arg.project.name.replace(/ /g, '-'))

    if (arg['cmd'] === 'log') {
      git.cwd(project_dir).log().then(result => {
        event.returnValue = result['all']
      })
        .catch(err => { event.returnValue = []; console.log(err) })

    } else if (arg['cmd'] === 'pull') {
      git.cwd(project_dir).pull()

    } else if (arg['cmd'] === 'push') {
      git.cwd(project_dir).add('./*').commit('test').push()

    } else if (arg['cmd'] === 'clone') {
      if (!fs.existsSync(project_dir)) {
        git.cwd(BASE_DIR).clone(arg.project.http)
      }
    }
  } else if (arg['cmd'] === 'diff') {
    git.show(arg['hash'])
      .then(result => {
        event.returnValue = parseGitDiff(result)
      })
      .catch(err => {
        event.returnValue = undefined
      });
  }
})

// User Settings -------------------------------------------------------------------
ipcMain.on('settings:get', (event) => {
  event.returnValue = storage.getSync('settings')
})

ipcMain.handle('settings:set', (event, settings) => {
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
