import { app, BrowserWindow, ipcMain, session } from 'electron';
import { projectAPI, gitAPI, settingsAPI } from './lib/api/main'
import { elevatedShell, checkInstalled } from './lib/pkg_manager'
import path from 'path'
import util from 'util'
import fs from 'fs'

import CMD from "./lib/pkg_manager/cmds";
import os from 'os'

const pty = require("node-pty");
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;



// ipcMain APIs 
projectAPI()
gitAPI()
settingsAPI()


const readFileAsync = util.promisify(fs.readFile)


ipcMain.on('pkg:getlogs', async (event, pkgs) => {
  const logPath = path.join(os.tmpdir(), 'initInstallBridge.log')
  if (fs.existsSync(logPath)) {
    const fileContent = await readFileAsync(logPath, 'utf-8')
    event.reply('pkg:getlogs', fileContent)
  }
})

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
        11
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
  ipcMain.on('terminal:fit', async (event) => {
    event.reply('terminal:fit', {})
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

