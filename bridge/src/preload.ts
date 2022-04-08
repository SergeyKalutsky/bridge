import { contextBridge, ipcRenderer } from "electron"
import { Project } from "./components/projects/types"
import { FileChanges, CreateInfo, ActivePath } from './types'
import { ParsedGitDiff } from './components/git/types'


contextBridge.exposeInMainWorld('shared', {
    incomingData: (channel, callback) => { ipcRenderer.on(channel, (event, ...args) => callback(...args)) },
    removeListeners: (channel) => { ipcRenderer.removeAllListeners(channel) }
})

contextBridge.exposeInMainWorld('settings', {
    set: (val: any): Promise<any> => ipcRenderer.invoke('settings:set', val),
    get: (key: string): any => ipcRenderer.sendSync('settings:get', key),
    del: (key: string): any => ipcRenderer.invoke('settings:del', key)

})

contextBridge.exposeInMainWorld('projects', {
    mkbasedir: (data) => ipcRenderer.send('projects:mkbasedir', { user: data }),
    getLocalProjectsNames: (): any => ipcRenderer.sendSync('projects:getlocalprojectsnames'),
    delete: (project_name): void => ipcRenderer.send('projects:delete', project_name),
    showFiles: (): void => ipcRenderer.send('projects:listfiles'),
    readActiveFile: (filepath: string): void => ipcRenderer.send('projects:readactivefile', filepath),
    writeActiveFile: (fileChange: FileChanges): void => ipcRenderer.send('projects:writeactivefile', fileChange),
    createFile: (createInfo: CreateInfo): void => ipcRenderer.send('projects:createfile', createInfo),
    renameFile: (data: { new_name: string, path: ActivePath }): void => ipcRenderer.send('projects:renamefile', data),
    createFolder: (createInfo: CreateInfo): void => ipcRenderer.send('projects:createfolder', createInfo),
    deleteTreeElement: (activePath: ActivePath): void => ipcRenderer.send('projects:deletetreeelement', activePath),
    mkprojectdir: (project_name: string): void => ipcRenderer.send('projects:mkprojectdir', project_name),
    copyFile: (args: { src: string, destination: string, root: boolean }): void => ipcRenderer.send('projects:copyfile', args)
})

contextBridge.exposeInMainWorld('git', {
    clone: (project: Project) => ipcRenderer.send('git:clone', project),
    pull: () => ipcRenderer.send('git:pull'),
    push: () => ipcRenderer.send('git:push'),
    commit: () => ipcRenderer.send('git:commit'),
    log: () => ipcRenderer.sendSync('git:log'),
    diff: (hash: string): ParsedGitDiff[] => ipcRenderer.sendSync('git:diff', hash),
    init: (project_name: string) => ipcRenderer.send('git:init', project_name)
})


contextBridge.exposeInMainWorld('terminal', {
    keystoke: (e) => ipcRenderer.send('terminal:keystroke', e),
    fit: (data: { x?: number, y?: number }): void => ipcRenderer.send('terminal:fit', data)
})

contextBridge.exposeInMainWorld('pkg', {
    install: (pkgs: string[]) => ipcRenderer.send('pkg:install', pkgs),
    checkInstall: (pkgs: string[]) => ipcRenderer.send('pkg:check', pkgs),
    getlogs: () => ipcRenderer.send('pkg:getlogs')
})

