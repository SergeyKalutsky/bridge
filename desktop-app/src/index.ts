import fs from 'fs'
import path from 'path'
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


storage.get('settings', function (error: Error, data: settings) {
  if (!('data_storage' in data)) {
    storage.set('settings', {
      ...data,
      data_storage: storage.getDataPath()
    },
      (error: Error) => {
        if (error) throw error;
      })
  }
})

ipcMain.on('git', (event, arg) => {
  if (arg['cmd'] === 'log') {
    if (git !== undefined) {
      git.log().then(result => {
        event.returnValue = result
      })
        .catch(err => { event.returnValue = []; console.log(err) })
    } else {
      event.returnValue = []
    }
  } else if (arg['cmd'] === 'diff') {
    git.show(arg['hash'])
      .then(result => {
        event.returnValue = parseGitDiff(result)
      })
      .catch(err => {
        event.returnValue = undefined
      });
  } else if (arg['cmd'] === 'pull') {
    if (git !== undefined) {
      git.pull()
    }
  } else if (arg['cmd'] === 'push') {
    if (git !== undefined) {
      git.add('./*').commit('test').push()
    }
  }
})

// User Settings -------------------------------------------------------------------
ipcMain.on('user-settings-set-request', (event, arg) => {
  storage.get('settings', function (error: Error, data: settings) {
    if (!('projects' in data)) {
      const dir = path.join(storage.getDataPath(), data['user']['login'])
      fs.readdir(dir, (err, files) => {
        if (err) throw err
        files.forEach(file => {
          console.log(file);
        });
      });

    }
    storage.set('settings', { ...data, ...arg }, function (error: Error) {
      if (error) throw error;
    })
  })
})


ipcMain.on('user-settings-get-request', (event, arg) => {
  storage.get('settings', function (error: Error, data: settings) {
    if (error) throw error;
    event.returnValue = data
  });
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

// ipcMain.on('cmd', (event, arg) => {
//   elevatedShell({ command: `apt-get update` },
//     async (error?: Error, data?: string | Buffer) => {
//       await event.reply('stdout', data.toString())
//     })
// })

