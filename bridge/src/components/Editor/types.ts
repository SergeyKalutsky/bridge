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

export { ActivePath, FileObject, IDE }