import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { elevatedShell } from './elevated_shell/shell'
import { spawn } from 'child_process';
import {Git} from "nodegit"

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;



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
  elevatedShell({ command: `-NoProfile -InputFormat None -ExecutionPolicy Bypass -Command [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(''https://chocolatey.org/install.ps1'')); Read-Host ''Type ENTER to exit''`},
    async (error?: Error, data?: string | Buffer) => {
      await event.reply('stdout', data.toString())
    })
})



// powershell.exe -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command Start-Process 'powershell.exe' -ArgumentList '-NoProfile -InputFormat None -ExecutionPolicy Bypass -Command [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; iex ((New-Object System.Net.WebClient).DownloadString(''https://chocolatey.org/install.ps1'')); choco upgrade -y python visualstudio2019-workload-vctools; Read-Host ''Type ENTER to exit'' ' -Verb RunAs

// `Set-ExecutionPolicy Bypass -Scope Process -Force; 
// [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; 
// iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1')); 
// choco install -y git; 
// choco install -y python; 
// choco install -y vscode`