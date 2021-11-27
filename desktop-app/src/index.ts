import { app, BrowserWindow, ipcMain } from 'electron';
import storage from 'electron-json-storage';
import parseGitDiff from './git_api/parse'
import { git } from './git_api/index'
import { join } from 'path'
import fs from 'fs'


declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
const GITLAB = 'https://gitlab.bridgeacross.xyz'
const BASEE_DIR = storage.getDataPath()

// Projects ===========================================================
ipcMain.on('projects', (event, arg) => {
  if (arg['cmd'] === 'delete') {
    const dir = join(BASEE_DIR, arg.project.name.replace(/ /g, '-'))
    fs.rmdirSync(dir, { recursive: true });
  }
})

// GIT ---------------------------------------------------------------
ipcMain.on('git', (event, arg) => {

  if (arg.project !== undefined) {
    const project_dir = join(BASEE_DIR, arg.project.name.replace(/ /g, '-'))

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
        const folder = arg.project.name.replace(/ /g, '-')
        git.cwd(BASEE_DIR)
          .clone(`${GITLAB}/${arg.user.login}/${folder}.git`)
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
ipcMain.on('user-settings', (event, arg) => {
  if (arg['cmd'] === 'get') {
    storage.get('settings', (error: Error, data: any) => {
      event.returnValue = data
    });
  } else if (arg['cmd'] == 'set') {
    storage.set('settings', arg['settings'])
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
