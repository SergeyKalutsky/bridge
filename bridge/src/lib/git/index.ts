import path from 'path'
// node.js example
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'

function Utf8ArrayToStr(array) {
    let out, i, c;
    let char2, char3;


    out = "";
    const len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}


// const getFileChanges = async (oid: string, oid_prev: string) => {
//     const A = git.TREE({ ref: oid })
//     const B = git.TREE({ ref: oid_prev })
//     console.log('here', A, B, oid, oid_prev)
//     // Get a list of the files that changed
//     const fileChanges = [];
//     await git.walk({
//         fs: fs,
//         dir: '/Users/sergeykalutsky/Library/Application Support/bridge/storage/guest/test_flask',
//         trees: [A, B],
//         map: async function (filename, [A, B]) {
//             if (await A.type() === 'tree') return

//             if (B === null) {
//                 const Auint8array = await A.content()
//                 fileChanges.push({
//                     filename: filename,
//                     newFile: Utf8ArrayToStr(Auint8array),
//                     oldFile: ''
//                 })
//                 return
//             }

//             const Auint8array = await A.content()
//             const Buint8array = await B.content()
//             console.log(Auint8array, Buint8array)

//             fileChanges.push({
//                 filename: filename,
//                 newFile: Utf8ArrayToStr(Auint8array),
//                 oldFile: Utf8ArrayToStr(Buint8array)
//             })

//         }
//     })
//     return fileChanges
// }

function cleanEmptyFoldersRecursively(folder) {
    const isDir = fs.statSync(folder).isDirectory();
    if (!isDir) {
        return;
    }
    let files = fs.readdirSync(folder);
    if (files.length > 0) {
        files.forEach(function (file) {
            const fullPath = path.join(folder, file);
            cleanEmptyFoldersRecursively(fullPath);
        });

        // re-evaluate files; after deleting subfolder
        // we may have parent folder empty now
        files = fs.readdirSync(folder);
    }
    if (files.length == 0) {
        console.log("removing: ", folder);
        fs.rmdirSync(folder);
        return;
    }
}

const revertChanges = async (oid: string, oid_revert: string, dir: string) => {
    const A = git.TREE({ ref: oid })
    const B = git.TREE({ ref: oid_revert })
    dir = '/Users/sergeykalutsky/Library/Application Support/bridge/storage/guest/test_flask',
        await git.walk({
            fs: fs,
            dir: dir,
            trees: [A, B],
            map: async function (filename, [A, B]) {

                const filePath = path.join(dir, filename)
                const dirPath = path.dirname(filePath)

                if (A === null) {
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdir(dirPath, { recursive: true }, async (err) => {
                            if (err) throw err;
                        });
                    }
                    const oldContent = Utf8ArrayToStr(await B.content())
                    fs.writeFile(filePath, oldContent, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                    return
                }

                if (await A.type() === 'tree') return

                if (B === null) {
                    fs.unlinkSync(filePath);
                    return
                }
                const oldContent = Utf8ArrayToStr(await B.content())
                fs.writeFile(filePath, oldContent, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            }
        })
    cleanEmptyFoldersRecursively(dir)
}

const main = async () => {
    const current = '422f6974b491415345c8bd79b2101fa885d63b42'
    const previous = '559ebac92ba8bcb963642c626f3e6a55fe5fabdd'
    await revertChanges(current, previous, '')
}
main()

