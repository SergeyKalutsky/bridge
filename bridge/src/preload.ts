import { FileChanges, CreateInfo, ActivePath, Package } from './types'
import { contextBridge, ipcRenderer } from "electron"
import { ParsedGitDiff } from './components/git/types'
import { FileObject } from './components/Editor/types'
import { Project } from "./components/projects/types"

contextBridge.exposeInMainWorld('shared', {
    incomingData: (channel, callback) => { ipcRenderer.on(channel, (event, ...args) => callback(...args)) },
    removeListeners: (channel) => { ipcRenderer.removeAllListeners(channel) }
})

contextBridge.exposeInMainWorld('settings', {
    set: (val: any): Promise<any> => ipcRenderer.invoke('settings:set', val),
    get: (key: string): any => ipcRenderer.sendSync('settings:get', key),
    del: (key: string): any => ipcRenderer.invoke('settings:del', key),
    logPath: (): string => ipcRenderer.sendSync('settings:logpath'),

})

contextBridge.exposeInMainWorld('projects', {
    mkbasedir: (data) => ipcRenderer.send('projects:mkbasedir', { user: data }),
    getLocalProjectsNames: (): any => ipcRenderer.sendSync('projects:getlocalprojectsnames'),
    delete: (project_name): void => ipcRenderer.send('projects:delete', project_name),
    showFiles: (): Promise<FileObject[]> => ipcRenderer.invoke('projects:listfiles'),
    readActiveFile: (filepath: string): Promise<string> => ipcRenderer.invoke('projects:readactivefile', filepath),
    writeActiveFile: (fileChange: FileChanges): void => ipcRenderer.send('projects:writeactivefile', fileChange),
    createFile: (createInfo: CreateInfo): Promise<string> => ipcRenderer.invoke('projects:createfile', createInfo),
    createFolder: (createInfo: CreateInfo): Promise<string> => ipcRenderer.invoke('projects:createfolder', createInfo),
    renameFile: (data: { new_name: string, path: ActivePath }): string => ipcRenderer.sendSync('projects:renamefile', data),
    deleteTreeElement: (activePath: ActivePath): void => ipcRenderer.send('projects:deletetreeelement', activePath),
    mkprojectdir: (project_name: string): void => ipcRenderer.send('projects:mkprojectdir', project_name),
    copyFile: (args: { src: string, destination: string, root: boolean }): Promise<void> => ipcRenderer.invoke('projects:copyfile', args)
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
    exec: (data: { exec: string, path: string }) => ipcRenderer.send('terminal:exec', data),
    keystoke: (e) => ipcRenderer.send('terminal:keystroke', e),
    fit: (data: { x?: number, y?: number }): void => ipcRenderer.send('terminal:fit', data)
})

contextBridge.exposeInMainWorld('pkg', {
    install: (pkgs: Package[]): void => ipcRenderer.send('pkg:install', pkgs),
    getlogs: () => ipcRenderer.send('pkg:getlogs'),
    check: (pkgs: Package[]): void => ipcRenderer.send('pkg:check', pkgs)
})

