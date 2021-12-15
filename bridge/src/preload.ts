import { contextBridge, ipcRenderer } from "electron"

type ParsedGitDiff = {
    filename: string
    oldFile: string
    newFile: string
}

contextBridge.exposeInMainWorld('settings', {
    set: (settings: any): Promise<any> => ipcRenderer.invoke('settings:set', settings),
    get: (): any => ipcRenderer.sendSync('settings:get')
})

contextBridge.exposeInMainWorld('projects', {
    mkbasedir: (data) => ipcRenderer.send('projects:mkbasedir', { user: data }),
    getLocalProjectsNames: (): any => ipcRenderer.sendSync('projects:getlocalprojectsnames'),
    delete: (project_name): any => ipcRenderer.send('projects:delete', project_name),
    showFiles: (): Promise<any> => ipcRenderer.invoke('projects:listfiles'),
    setActiveFile: (filepath: string): string => ipcRenderer.sendSync('projects:setactivefile', filepath)
})

contextBridge.exposeInMainWorld('git', {
    clone: (project: any) => ipcRenderer.send('git:clone', project),
    pull: () => ipcRenderer.send('git:pull'),
    push: () => ipcRenderer.send('git:push'),
    log: () => ipcRenderer.sendSync('git:log'),
    diff: (hash: string): ParsedGitDiff[] => ipcRenderer.sendSync('git:diff', hash)
})