import fs from 'fs'
import path from 'path'

interface FileObject {
    name: string
    files?: string[]
    path: string
    isDirectory: boolean
}

function walkSync(dir: string): FileObject[] {
    const folderFiles = []
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.name === '.git') { continue }
        if (file.isDirectory()) {
            folderFiles.push({
                name: file.name,
                files: walkSync(path.join(dir, file.name)),
                isDirectory: true,
                path: path.join(dir, file.name)
            })
        } else {
            folderFiles.push({
                name: file.name,
                isDirectory: false,
                path: path.join(dir, file.name)
            })
        }
    }
    return folderFiles
}


export default walkSync