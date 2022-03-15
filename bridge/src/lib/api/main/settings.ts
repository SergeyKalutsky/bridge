import { ipcMain } from 'electron';
import { store } from './storage'

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

function settingsAPI(): void {
    get()
    set()
}

export default settingsAPI