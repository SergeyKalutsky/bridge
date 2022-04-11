import { ipcMain } from 'electron';
import { store } from './storage'
import { LOG_PATH } from './storage';

function get() {
    return ipcMain.on('settings:get', (event, field) => {
        event.returnValue = store.get(field)
    })
}

function set() {
    ipcMain.handle('settings:set', (event, data) => {
        store.set(data)
    })
}

function logPath() {
    return ipcMain.on('settings:logpath', (event, field) => {
        event.returnValue = LOG_PATH
    })
}

function del () {
    return ipcMain.handle('settings:del', (event, data) => {
        store.delete(data)
    })
}

function settingsAPI(): void {
    get()
    set()
    del()
    logPath()
}

export default settingsAPI