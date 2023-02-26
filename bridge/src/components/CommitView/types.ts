interface ActivePath {
    path: string
    isDirectory: boolean
}

interface FileObject {
    name: string
    isOpen?: boolean
    files?: FileObject[]
    path: string
    isDirectory: boolean
}

interface IDE {
    editor: JSX.Element,
    activePath: ActivePath,
    files: FileObject[],
    fileTree: JSX.Element[],
    branch: string
}

interface ExecControl {
    type: string
    jsx: JSX.Element
}

interface GitStatus {
    canCommit: boolean
    canPush: boolean
}

export { ActivePath, FileObject, IDE, ExecControl, GitStatus }