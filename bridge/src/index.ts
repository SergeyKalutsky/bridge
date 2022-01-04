import { app, BrowserWindow, ipcMain, session } from 'electron';
import { registerProjectAPI, registerGitAPI } from './lib/api/main'
import { elevatedShell, checkInstalled } from './lib/pkg_manager'
import CMD from "./lib/pkg_manager/cmds";
import os from 'os'


const pty = require("node-pty");
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

const storage = require('electron-json-storage')

// ipcMain APIs 
registerProjectAPI()
registerGitAPI()

ipcMain.on('pkg:check', async (event, pkgs) => {
  for (const pkg of pkgs) {
    checkInstalled(pkg, (installed) => {
      event.reply('pkg:check', { installed: installed, pkg: pkg })
    })
  }
})

ipcMain.on('pkg:install', (event, pkgs) => {
  let command = ''
  const platform = process.platform;
  for (const pkg of pkgs) {
    command += CMD[pkg].install[platform] + '; '
  }
  elevatedShell({ command: command },
    async (error?: Error, data?: string | Buffer) => {
      if (data.toString() === 'refreshenv') {
        for (const pkg of pkgs) {
          if (!(process.env.Path.includes(CMD[pkg].path[platform]))) {
            process.env.Path += CMD[pkg].path[platform]
          }
          checkInstalled(pkg, (installed) => {
            event.reply('pkg:check', { installed: installed, pkg: pkg })
          })
        }
      }
    })
})

// User Settings 
ipcMain.on('settings:get', (event) => {
  event.returnValue = storage.getSync('settings')
})


ipcMain.handle('settings:set', (event, new_settings) => {
  let settings = storage.getSync('settings')
  settings = { ...settings, ...new_settings }
  storage.set('settings', settings)
})

// Usual Stuff
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

  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });

  ptyProcess.on('data', function (data) {
    mainWindow.webContents.send("terminal:incomingdata", data);
  });
  ipcMain.on("terminal:keystroke", (event, key) => {
    ptyProcess.write(key);
  });


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

