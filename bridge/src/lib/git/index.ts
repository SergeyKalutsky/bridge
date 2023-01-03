import path from 'path'
// node.js example
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'

const dir = path.join(process.cwd(), 'contexto-ru')
const author = { name: 'SergeyKalutsky', email: 'skalutsky@gmail.com' }

const url = 'https://github.com/SergeyKalutsky/contextoru.git'
// git.clone({ fs, http, dir, url: url }).then(console.log)

// git.log({fs, dir}).then(console.log)

// pull Why the author required is beyound me
// git.pull({fs, http, dir, author }).then(console.log)

// commmit
// const message = 'added .csv format'
// git.commit({fs, dir, message, author})

// await git.init({ fs, dir: '/tutorial' })

const getLogs = async () => {
    // returns list of all commits
    // one commit looks like that:
    // {
    //     oid: 'cb00b067e558c3c0583323b07908a7ecf7195567',
    //     commit: {
    //       message: 'mostly works\n',
    //       parent: [ 'd0176a6d95ce46a31353b8ef15613a4b80d2bb09' ],
    //       tree: '922e29d337bef925d0ccaacde1e0f5542dfb74ec',
    //       author: {
    //         name: 'SergeyKalutsky',
    //         email: 'skalutsky@gmail.com',
    //         timestamp: 1670941749,
    //         timezoneOffset: -180
    //       },
    //       committer: {
    //         name: 'SergeyKalutsky',
    //         email: 'skalutsky@gmail.com',
    //         timestamp: 1670941749,
    //         timezoneOffset: -180
    //       }
    //     },
    //     payload: 'tree 922e29d337bef925d0ccaacde1e0f5542dfb74ec\n' +
    //       'parent d0176a6d95ce46a31353b8ef15613a4b80d2bb09\n' +
    //       'author SergeyKalutsky <skalutsky@gmail.com> 1670941749 +0300\n' +
    //       'committer SergeyKalutsky <skalutsky@gmail.com> 1670941749 +0300\n' +
    //       '\n' +
    //       'mostly works\n'
    //   }
    const commits = await git.log({ fs, dir })
    const oids = commits.map(commit => commit.oid)
    return oids
}

const push = async () => {
    const pushResult = await git.push({
        fs,
        http,
        dir: dir,
        remote: 'origin',
        ref: 'master',
        onAuth: () => ({ username: 'SergeyKalutsky', password: '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' }),
    })
    console.log(pushResult)
}
function Utf8ArrayToStr(array) {
    let out, i, c;
    let char2, char3;
  
  
    out = "";
    const len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4)
      { 
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

const getFileChanges = async () => {
    // const oids = await getLogs()
    // console.log(oids)
    const A = git.TREE({ ref: 'b501a67fb56dc18757ed3fb18f4cfce83683f326' })
    const B = git.TREE({ ref: '70aafaaad6d364f7eb4f9f81da074c2a56385529' })
    // Get a list of the files that changed
    const fileChanges = new Set();
    await git.walk({
        fs: fs,
        dir: dir,
        trees: [A, B],
        map: async function (filename, [A, B]) {

            if (await A.type() === 'tree') return

            const Aoid = await A.oid();
            const Boid = await B.oid();

            // Skip pairs where the oids are the same
            if (Aoid === Boid) return
            const uint8array = await A.content()
            const type = await A.type()
            const string = Utf8ArrayToStr(uint8array)
            console.log(type)
            console.log(string)
            // console.log(path.join(dir, filename), Aoid)
            // const test = await git.readTree({fs, oid:Aoid, filepath: path.join(dir, filename)})
            // console.log(test)
            fileChanges.add({
                fullpath: filename,
                A: Aoid,
                B: Boid
            })

        }
    })
    console.log(fileChanges)
    // return fileChanges
}

const gitDiff = async () => {
    const oid = 'cb00b067e558c3c0583323b07908a7ecf7195567'
    const commit = await git.readCommit({ fs, dir: dir, oid: oid })
    console.log(commit)
}
getFileChanges()
