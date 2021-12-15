import fs from 'fs'
import path from 'path'

interface Folder {
    name: string
    files: string[]
}

function walkSync(dir: string): string[] | Folder[] {
    const folderFiles = []
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            const innerFolderFiles = walkSync(path.join(dir, file.name))
            folderFiles.push({ name: file.name, files: innerFolderFiles })
        } else {
            folderFiles.push(file.name)
        }
    }
    return folderFiles
}

export default walkSync