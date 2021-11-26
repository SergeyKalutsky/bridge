import { app, BrowserWindow, ipcMain } from 'electron';
import storage from 'electron-json-storage';
import parseGitDiff from './git_api/parse'
import { git } from './git_api/index'
import { join } from 'path'
import fs from 'fs'


declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
const GITLAB = 'https://gitlab.bridgeacross.xyz'


// Projects ===========================================================
ipcMain.on('projects', (event, arg) => {
  if (arg['cmd'] === 'delete') {
    const settings = storage.getSync('settings');
    const dir = join(storage.getDataPath(), arg['project']['name'].replace(/ /g, '-'))

    fs.rmdirSync(dir, { recursive: true });
    if (settings.active_project !== undefined && settings.active_project.name === arg['project']['name']) {
      delete settings.active_project
      storage.set('settings', settings);
    }
  }
})

// GIT ---------------------------------------------------------------
ipcMain.on('git', (event, arg) => {
  const settings = storage.getSync('settings');
  let project_git = ''
  if (!('active_project' in settings)) {
    project_git = arg['project']['name'].replace(/ /g, '-')
  } else {
    project_git = settings.active_project
  }

  if (arg['cmd'] === 'log') {
    git.cwd(project_git).log().then(result => {
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
    git.cwd(project_git).pull()

  } else if (arg['cmd'] === 'push') {
    git.cwd(project_git).add('./*').commit('test').push()

  } else if (arg['cmd'] === 'clone') {
    if (!fs.existsSync(join(storage.getDataPath(), project_git))) {
      git.cwd(storage.getDataPath())
        .clone(`${GITLAB}/${settings.user.login}/${project_git}.git`)
    }

  }
})

// User Settings -------------------------------------------------------------------
ipcMain.on('user-settings', (event, arg) => {
  if (arg['cmd'] === 'set') {
    storage.getAll(function (error: Error, data: any) {
      storage.set('settings', { ...data['settings'], ...arg['data'] })
    })
  }
  if (arg['cmd'] === 'get') {
    storage.getAll(function (error: Error, data: any) {
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
