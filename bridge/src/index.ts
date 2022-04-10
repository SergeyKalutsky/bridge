import { app, BrowserWindow, ipcMain, session } from 'electron';
import { projectAPI, gitAPI, settingsAPI, pkgAPI } from './lib/api/main'
import { store } from './lib/api/main/storage';
import os from 'os'

const pty = require("node-pty");
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
const contextMenu = require('electron-context-menu');
contextMenu({
  showSearchWithGoogle: false,
  showCopyImage: false,
  showInspectElement: false
});

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;


// ipcMain APIs 
projectAPI()
gitAPI()
settingsAPI()
pkgAPI()

// Usual Stuff
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    height: 1200,
    width: 1500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
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
  ipcMain.on("terminal:exec", (event, { exec, path }) => {
    const binary = store.get(`pkgs.${exec}`)
    ptyProcess.write(`${binary} ${path} \r`);
  });
  ipcMain.on('terminal:fit', async (event, data) => {
    event.reply('terminal:fit', data)
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

