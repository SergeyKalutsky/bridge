import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron';
import { git } from './git_api/index'
import storage from 'electron-json-storage';
import parseGitDiff from './git_api/parse'

type settings = {
  data_storage?: string,
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
let git_cwd = storage.getDataPath()

// GIT ---------------------------------------------------------------
ipcMain.on('git', (event, arg) => {
  if (arg['cmd'] === 'log') {
    console.log(git_cwd)
    git.cwd(git_cwd).log().then(result => {
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
    git.cwd(git_cwd).pull()
  } else if (arg['cmd'] === 'push') {
    git.cwd(git_cwd).add('./*').commit('test').push()
  } else if (arg['cmd'] === 'clone') {
    storage.get('settings', function (error: Error, data: settings) {
      if (data !== null && 'active_project' in data) {
        const project_git = arg['project']['name'].replace(/ /g, '-')
        const remote = `https://gitlab.bridgeacross.xyz/${data['user']['login']}/${project_git}.git`
        git.cwd(storage.getDataPath()).clone(remote)
        git_cwd = join(storage.getDataPath(), project_git)
      }
    })
  }
})

// User Settings -------------------------------------------------------------------
ipcMain.on('user-settings', (event, arg) => {
  if (arg['cmd'] === 'set') {
    storage.get('settings', function (error: Error, data: settings) {
      if (!('data_storage' in data)) {
        data['data_storage'] = storage.getDataPath()
      }
      storage.set('settings', { ...data, ...arg['data'] }, function (error: Error) {
        if (error) throw error;
      })
    })
  }
  if (arg['cmd'] === 'get') {
    storage.get('settings', function (error: Error, data: settings) {
      if (error) throw error;
      event.returnValue = data
    });
  }
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
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
