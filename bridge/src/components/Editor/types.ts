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


export { ActivePath, FileObject }