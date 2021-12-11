import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('settings', {
    set: (settings: any): Promise<any> => ipcRenderer.invoke('settings:set', settings),
    get: (): any => ipcRenderer.sendSync('settings:get')
})

contextBridge.exposeInMainWorld('projects',  {
    mkbasedir: (data) => ipcRenderer.send('projects:mkbasedir', { user: data })
})