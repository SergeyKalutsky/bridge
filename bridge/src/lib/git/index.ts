// node.js example
import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'

const dir = path.join(process.cwd(), 'contexto-ru')
const author = {name: 'SergeyKalutsky', email: 'skalutsky@gmail.com'}

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
    // returns logs of a view
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
    const logs = await git.log({fs, dir})
    return logs
}

const push = async ()=>{
    const pushResult = await git.push({
        fs,
        http,
        dir: dir,
        remote: 'origin',
        ref: 'master',
        onAuth: () => ({ username: 'SergeyKalutsky', password:  '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'}),
      })
      console.log(pushResult)
}

push()
