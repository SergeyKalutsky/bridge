
interface ActivePath {
    path: string
    isDirectory: boolean
}

interface CreateInfo {
    name: string
    activePath: ActivePath
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

interface Package {
    installed: boolean,
    name: string,
    manager: string,
    version?: string
}

export {
    FileChanges,
    CreateInfo,
    ActivePath,
    Settings,
    Package
}