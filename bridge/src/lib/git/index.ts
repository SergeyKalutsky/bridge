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

const getFileChanges = async (oid: string, oid_prev: string) => {
    const A = git.TREE({ ref: oid })
    const B = git.TREE({ ref: oid_prev })
    console.log('here', A, B, oid, oid_prev)
    // Get a list of the files that changed
    const fileChanges = [];
    await git.walk({
        fs: fs,
        dir: '/Users/sergeykalutsky/Library/Application Support/bridge/storage/guest/test_flask',
        trees: [A, B],
        map: async function (filename, [A, B]) {
            if (await A.type() === 'tree') return
            
            if (B === null) {
                const Auint8array = await A.content()
                fileChanges.push({
                    filename: filename,
                      newFile: Utf8ArrayToStr(Auint8array),
                      oldFile: ''
                })
                return 
            }
            const Aoid = await A.oid();
            const Boid = await B.oid();
            const Auint8array = await A.content()
            const Buint8array = await B.content()
            console.log(Auint8array, Buint8array)

            // Skip pairs where the oids are the same
            if (Aoid === Boid) return

            fileChanges.push({
                filename: filename,
                  newFile: Utf8ArrayToStr(Auint8array),
                  oldFile: Utf8ArrayToStr(Buint8array)
            })

        }
    })
    return fileChanges
}

const main = async () => {
    const res = await getFileChanges('4915ab99d7a8c80c7296b48268490cad468098ec', '')
    console.log(res)
}
main()

