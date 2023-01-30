import { FileChanges, CreateInfo, ActivePath, Package, Template } from './types'
import { contextBridge, ipcRenderer } from "electron"
import { GitDiff } from './components/git/types'
import { FileObject } from './components/Editor/types'

contextBridge.exposeInMainWorld('shared', {
    incomingData: (channel, callback) => { ipcRenderer.on(channel, (event, ...args) => callback(...args)) },
    removeListeners: (channel) => { ipcRenderer.removeAllListeners(channel) }
})

contextBridge.exposeInMainWorld('dialogue', {
    openImageFile: () => ipcRenderer.send('dialogue:openimagefile'),

})

contextBridge.exposeInMainWorld('settings', {
    set: (val: any): Promise<void> => ipcRenderer.invoke('settings:set', val),
    get: (key: string): any => ipcRenderer.sendSync('settings:get', key),
    del: (key: string): Promise<void> => ipcRenderer.invoke('settings:del', key),
    logPath: (): string => ipcRenderer.sendSync('settings:logpath'),
    platform: (): string => ipcRenderer.sendSync('settings:platform'),

})

contextBridge.exposeInMainWorld('projects', {
    openSystemFolder: (): void => ipcRenderer.send('projects:opensystemfolder'),
    getProjectTemplates: (query: string): Promise<Template[]> => ipcRenderer.invoke('projects:getprojecttemplates', query),
    loadimagebase64: (filepath: string): Promise<string> => ipcRenderer.invoke('projects:loadimagebase64', filepath),
    mkbasedir: (data) => ipcRenderer.send('projects:mkbasedir', { user: data }),
    getLocalProjectsNames: (): any => ipcRenderer.sendSync('projects:getlocalprojectsnames'),
    delete: (project_name): void => ipcRenderer.send('projects:delete', project_name),
    showFiles: (): Promise<FileObject[]> => ipcRenderer.invoke('projects:listfiles'),
    readActiveFile: (filepath: string): Promise<string> => ipcRenderer.invoke('projects:readactivefile', filepath),
    writeActiveFile: (fileChange: FileChanges): void => ipcRenderer.send('projects:writeactivefile', fileChange),
    createFile: (createInfo: CreateInfo): Promise<string> => ipcRenderer.invoke('projects:createfile', createInfo),
    createFolder: (createInfo: CreateInfo): Promise<string> => ipcRenderer.invoke('projects:createfolder', createInfo),
    renameFile: (data: { new_name: string, path: ActivePath }): string => ipcRenderer.sendSync('projects:renamefile', data),
    rename: ({ newName, activePath }: { newName: string, activePath: ActivePath }): Promise<ActivePath> => ipcRenderer.invoke('projects:rename', { newName, activePath }), deleteTreeElement: (activePath: ActivePath): void => ipcRenderer.send('projects:deletetreeelement', activePath),
    mkprojectdir: (project_name: string): void => ipcRenderer.send('projects:mkprojectdir', project_name),
    copyFile: (args: { src: string, destination: string, root: boolean }): Promise<void> => ipcRenderer.invoke('projects:copyfile', args)
})

contextBridge.exposeInMainWorld('git', {
    checkoutBranch: ({ branch }: { branch: string }): Promise<void> => ipcRenderer.invoke('git:checkoutbranch', { branch }),
    listBranches: (): Promise<string[]> => ipcRenderer.invoke('git:listbranches'),
    addGitHubRemote: ({ repo, token, url }: { repo: string, token: string, url: string }): void => ipcRenderer.send('git:pushremote', { repo, token, url }),
    testGitHubToken: ({ repo, token, git_url }: { repo: string, token: string, git_url: string }): void => ipcRenderer.send('git:testtoken', { repo, token, git_url }),
    getCurrentBranch: (): Promise<string> => ipcRenderer.invoke('git:getcurrentbranch'),
    clone: ({ repo, git_url }: { repo: string, git_url: string }): void => ipcRenderer.send('git:clone', { repo, git_url }),
    pull: (): Promise<void> => ipcRenderer.invoke('git:pull'),
    push: (branch: string): Promise<void> => ipcRenderer.invoke('git:push', branch),
    commit: (): Promise<void> => ipcRenderer.invoke('git:commit'),
    status: (): Promise<string[]> => ipcRenderer.invoke('git:status'),
    headPositonLocal: ({ branch, url }: { branch: string, url: string }): Promise<string> => ipcRenderer.invoke('git:headpositionlocal', { branch, url }),
    log: () => ipcRenderer.sendSync('git:log'),
    diff: (args: { oid: string, oid_prev: string }): GitDiff[] => ipcRenderer.sendSync('git:diff', args),
    init: (project_name: string) => ipcRenderer.send('git:init', project_name),
    revert: (args: { oid: string, oid_prev: string }): Promise<void> => ipcRenderer.invoke('git:revert', args)
})


contextBridge.exposeInMainWorld('terminal', {
    exec: (data: { exec: string, path: string }) => ipcRenderer.send('terminal:exec', data),
    keystoke: (e) => ipcRenderer.send('terminal:keystroke', e),
    fit: (data: { x?: number, y?: number }): void => ipcRenderer.send('terminal:fit', data)
})

contextBridge.exposeInMainWorld('pkg', {
    install: (pkgs: Package[]): void => ipcRenderer.send('pkg:install', pkgs),
    getlogs: (): void => ipcRenderer.send('pkg:getlogs'),
    check: (pkgs: Package[]): void => ipcRenderer.send('pkg:check', pkgs),
    sudo: (password: string): void => ipcRenderer.send('pkg:sudo', password)
})

