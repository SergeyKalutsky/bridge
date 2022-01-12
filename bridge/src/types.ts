
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