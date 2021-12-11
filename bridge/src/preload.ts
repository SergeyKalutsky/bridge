import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('settings', {
    set: (settings: any): any => ipcRenderer.invoke('settings:set', settings),
    get: (): any => ipcRenderer.invoke('settings:get')
})