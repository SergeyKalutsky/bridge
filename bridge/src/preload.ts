import { contextBridge, ipcRenderer } from "electron"
import { FileChanges, CreateInfo, ActivePath } from './types'
import { ParsedGitDiff } from './components/git/types'


contextBridge.exposeInMainWorld('shared', {
    incomingData: (channel, callback) => { ipcRenderer.on(channel, (event, ...args) => callback(...args)) }
})

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
    createFile: (createInfo: CreateInfo): any => ipcRenderer.send('projects:createfile', createInfo),
    createFolder: (createInfo: CreateInfo): any => ipcRenderer.send('projects:createfolder', createInfo),
    deleteTreeElement: (activePath: ActivePath): any => ipcRenderer.send('projects:deletetreeelement', activePath)
})

contextBridge.exposeInMainWorld('git', {
    clone: (project: any) => ipcRenderer.send('git:clone', project),
    pull: () => ipcRenderer.send('git:pull'),
    push: () => ipcRenderer.send('git:push'),
    log: () => ipcRenderer.sendSync('git:log'),
    diff: (hash: string): ParsedGitDiff[] => ipcRenderer.sendSync('git:diff', hash)
})


contextBridge.exposeInMainWorld('terminal', {
    keystoke: (e) => ipcRenderer.send('terminal:keystroke', e)
})

contextBridge.exposeInMainWorld('pkg', {
    install: (pkgs: string[]) => ipcRenderer.send('pkg:install', pkgs),
    checkInstall: (pkgs: string[]) => ipcRenderer.send('pkg:check', pkgs),
    getlogs: () => ipcRenderer.send('pkg:getlogs', {})
})

