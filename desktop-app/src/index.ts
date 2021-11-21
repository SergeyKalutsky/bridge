import { app, BrowserWindow, ipcMain } from 'electron';
import { elevatedShell } from './elevated_shell/shell'
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import fs from 'fs'
import path from 'path'
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

let git: SimpleGit = undefined

const initGit = (data: settings) => {
  if (data !== null && 'active_project' in data) {
    const project_dir = path.join(data['data_storage'], data['active_project']['name'])
    const project_git = data['active_project']['name'].replace(/ /g, '-')
    const remote = `https://gitlab.bridgeacross.xyz/${data['user']['login']}/${project_git}.git`

    const options: Partial<SimpleGitOptions> = {
      baseDir: project_dir,
      binary: 'git',
      maxConcurrentProcesses: 6,
    };
    fs.stat(project_dir, (err, stat) => {
      if (err == null) {
        git = simpleGit(options)
      } else if (err.code == 'ENOENT') {
        simpleGit().clone(remote, project_dir)
          .then(() => git = simpleGit(options))
      }
    })
  }
}


storage.get('settings', function (error: Error, data: settings) {
  if ('active_project' in data) {
    initGit(data)
  }
  if (!('data_storage' in data)) {
    storage.set('settings', { ...data, data_storage: storage.getDataPath() },
      (error: Error) => {
        if (error) throw error;
      })
  }
})

ipcMain.on('git-diff', (event, arg) => {
  git.show(arg)
    .then(result => {
      event.returnValue = parseGitDiff(result)
    })
    .catch(err => {
      event.returnValue = undefined
    });
})


ipcMain.on('git-push', (event, arg) => {
  if (git !== undefined) {
    git.add('./*').commit('test').push()
  }
})

ipcMain.on('git-pull', (event, arg) => {
  if (git !== undefined) {
    git.pull()
  }
})

ipcMain.on('git-log', (event, arg) => {
  if (git !== undefined) {
    git.log().then(result => {
      event.returnValue = result
    })
  } else {
    event.returnValue = []
  }
})


ipcMain.on('user-settings-set-request', (event, arg) => {
  storage.get('settings', function (error: Error, data: settings) {
    if ('active_project' in arg) {
      initGit({ ...data, ...arg })
    }
    storage.set('settings', { ...data, ...arg }, function (error: Error) {
      if (error) throw error;
    })
  })
})


ipcMain.on('user-settings-get-request', (event, arg) => {
  storage.get('settings', function (error: Error, data: settings) {
    if (error) throw error;
    event.reply('user-settings-get-response', data)
  });
})


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('cmd', (event, arg) => {
  elevatedShell({ command: `apt-get update` },
    async (error?: Error, data?: string | Buffer) => {
      await event.reply('stdout', data.toString())
    })
})

