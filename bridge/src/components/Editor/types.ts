interface ActivePath {
    path: string
    isDirectory: boolean
}

interface FileObject {
    name: string
    files?: FileObject[]
    path: string
    isDirectory: boolean
}

interface IDE {
    editor: JSX.Element,
    activePath: ActivePath,
    files: FileObject[],
    fileTree: JSX.Element[]
}

export { ActivePath, FileObject, IDE }