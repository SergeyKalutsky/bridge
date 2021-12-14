import fs from 'fs'
import path from 'path'

function walkSync(dir) {
    const folderFiles = []
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            const innerFolderFiles = walkSync(path.join(dir, file.name))
            folderFiles.push({dir: innerFolderFiles})
        } else {
            folderFiles.push(file.name)
        }
    }
    return folderFiles
}

const files = walkSync(__dirname)
console.log(files[1].dir)