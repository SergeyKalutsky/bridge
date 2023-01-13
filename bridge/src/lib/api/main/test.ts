import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
import path from 'path'
import { Octokit } from "@octokit/core"

const fineGrainedToken = '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z5'
const personalToken = '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'

const octokit = new Octokit({ auth: fineGrainedToken });

async function tokenAcces() {
    try {
        const { data } = await octokit.request("/user");
        const pub = data.public_repos ? data.public_repos : 0 
        const priv = data.total_private_repos ? data.total_private_repos : 0
        if (pub + priv > 1) {
            console.log('Warning')
            return
        }
        console.log('fine')
    } catch (httpError) {
        console.log('badToken')
    }
}

async function createRepoAuthToken({ name }: { name: string; }): Promise<void> {
    try {
        const res = await octokit.request('POST /user/repos', {
            name: name,
            description: 'Test repo',
            homepage: 'https://github.com',
            'private': false,
            is_template: true
        })
    console.log(res)
    } catch (HttpError) {
        console.log(HttpError)
    }
}

async function createRepoFineGrainedToken(fineGrainedToken: string,
    username: string,
    templeHttp: string,
    dir: string) {

    // await git.clone({ fs, http, dir: dir, url: templeHttp }).then(console.log)
    // fs.rmSync(path.join(dir, '.git'), { recursive: true, force: true });
    // await git.init({ fs, dir: dir })
    // await git.add({ fs, dir: dir, filepath: '.' })
    // await git.commit({ fs, dir: dir, message: 'firstCommit', author: { name: username } })
    await git.push({
        fs, http, dir: dir, url: 'https://github.com/immmagg/test.git', ref: 'master',
        onAuth: () => ({ username: username, password: fineGrainedToken }),
    })

}
// const httpTemplate = 'https://github.com/SergeyKalutsky/discord_template.git'
// createRepoFineGrainedToken(fineGrainedToken, 'Sergey', httpTemplate, 'test')
tokenAcces()