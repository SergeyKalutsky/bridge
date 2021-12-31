import { Commit } from './components/git/types'
import { Project } from './components/projects/types'

declare global {
    interface Window {
        settings: {
            set(settings: any): Promise<any>;
            get(): any
        },
        projects: {
            mkbasedir(data: any): Promise<any>
            getLocalProjectsNames(): string[]
            delete(name: string): void
            showFiles(): Promise<any>
            readActiveFile(filepath: string): Promise<any>
            writeActiveFile(fileChange: FileChanges): any
            createFile(createInfo: CreateInfo): any
            createFolder(createInfo: CreateInfo): any
            deleteTreeElement(activePath: ActivePath): any
        },
        git: {
            clone(project: Project): void
            pull(): void
            push(): void
            log(): Commit[]
            diff(hash: string): ParsedGitDiff[]
        }
        terminal: {
            incomingData(channel, callback): any
            keystoke(e): any

        },
        pkg: {
            install(pkg: string): any
            checkInstall(pkg: string): any
        }
    }
}

interface ActivePath {
    path: string
    isDirectory: boolean
}

interface CreateInfo {
    name: string
    activePath: ActivePath
}

type ParsedGitDiff = {
    filename: string
    oldFile: string
    newFile: string
}

type FileChanges = {
    filepath: string
    fileContent: string
}


interface Settings {
    user?: {
        name?: string
        login?: string
        password?: string
        'X-API-Key'?: string
    }
    active_project?: {
        id: number
        name: string
        isclassroom: number
        isuserowner: number
    }
}


export {
    FileChanges,
    ParsedGitDiff,
    CreateInfo,
    ActivePath,
    Settings
}