import { app, BrowserWindow, ipcMain } from 'electron';
import storage from 'electron-json-storage';
import parseGitDiff from './git_api/parse'
import { git } from './git_api/index'
import { join } from 'path'

type Settings = {
  data_storage?: string,
  git_cwd: string,
  user?: {
    id: number,
    password: string,
    login: string,
    api_key: string
  },
  active_project?: {
    name: string
    id: string
  }
}

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
const GITLAB = 'https://gitlab.bridgeacross.xyz'
let settings: Settings

storage.get('settings', function (error: Error, data: Settings) {
  settings = data
  if (!('data_storage' in settings)) {
    settings.data_storage = storage.getDataPath()
  }
  if (!('git_cwd' in settings)) {
    settings.git_cwd = storage.getDataPath()
  }
})

// GIT ---------------------------------------------------------------
ipcMain.on('git', (event, arg) => {
  if (arg['cmd'] === 'log') {
    git.cwd(settings.git_cwd).log().then(result => {
      event.returnValue = result
    })
      .catch(err => { event.returnValue = []; console.log(err) })

  } else if (arg['cmd'] === 'diff') {
    git.show(arg['hash'])
      .then(result => {
        event.returnValue = parseGitDiff(result)
      })
      .catch(err => {
        event.returnValue = undefined
      });

  } else if (arg['cmd'] === 'pull') {
    git.cwd(settings.git_cwd).pull()

  } else if (arg['cmd'] === 'push') {
    git.cwd(settings.git_cwd).add('./*').commit('test').push()

  } else if (arg['cmd'] === 'clone') {
    const project_git = arg['project']['name'].replace(/ /g, '-')
    const remote = `${GITLAB}/${settings.user.login}/${project_git}.git`
    git.cwd(settings.data_storage).clone(remote)
    settings.git_cwd = join(settings.data_storage, project_git)
  }
})

// User Settings -------------------------------------------------------------------
ipcMain.on('user-settings', (event, arg) => {
  if (arg['cmd'] === 'set') {
    settings = { ...settings, ...arg['data'] }
    storage.set('settings', settings)
  }
  if (arg['cmd'] === 'get') {
    event.returnValue = settings
  }
})

// Usual Stuff ---------------------------------------------------------------------
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  storage.set('settings', settings)
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1200,
    width: 1500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    storage.set('settings', settings)
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
