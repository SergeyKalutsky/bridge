import { contextBridge, ipcRenderer } from "electron"

type ParsedGitDiff = {
    filename: string
    oldFile: string
    newFile: string
}

type FileChanges = {
    filepath: string
    fileContent: string
}

interface ActivePath {
    path: string
    isDirectory: boolean
}

interface CreateInfo {
    name: string
    activePath: ActivePath
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
    readActiveFile: (filepath: string): Promise<any> => ipcRenderer.invoke('projects:readactivefile', filepath),
    writeActiveFile: (fileChange: FileChanges): any => ipcRenderer.send('projects:writeactivefile', fileChange),
    createFile: (createInfo: CreateInfo): any => ipcRenderer.send('projects:createfile', createInfo)
})

contextBridge.exposeInMainWorld('git', {
    clone: (project: any) => ipcRenderer.send('git:clone', project),
    pull: () => ipcRenderer.send('git:pull'),
    push: () => ipcRenderer.send('git:push'),
    log: () => ipcRenderer.sendSync('git:log'),
    diff: (hash: string): ParsedGitDiff[] => ipcRenderer.sendSync('git:diff', hash)
})