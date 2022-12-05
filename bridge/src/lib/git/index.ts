// node.js example
import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'

const dir = path.join(process.cwd(), 'contexto-ru')
const author = {name: 'SergeyKalutsky', email: 'skalutsky@gmail.com'}

// const url = 'https://github.com/SergeyKalutsky/contextoru.git'
// git.clone({ fs, http, dir, url: url }).then(console.log)

// git.log({fs, dir}).then(console.log)

// pull Why the author required is beyound me
// git.pull({fs, http, dir, author }).then(console.log)

// commmit
// const message = 'added .csv format'
// git.commit({fs, dir, message, author})

// await git.init({ fs, dir: '/tutorial' })
const test = async () => {
    const res = await git.log({fs, dir})
    console.log(res)
}

test()
