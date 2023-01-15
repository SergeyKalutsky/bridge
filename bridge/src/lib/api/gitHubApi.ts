import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
import path from 'path'
import { Octokit } from "@octokit/core"

export async function userLogin(token: string) {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.request("/user");
    return data.login
}

export async function createGihHubRepo({ name, token }: { name: string, token: string }): Promise<number> {
    const octokit = new Octokit({ auth: token });
    try {
        const res = await octokit.request('POST /user/repos', {
            name: name,
            homepage: 'https://github.com',
            'private': false,
            is_template: true
        })
        return 200
    } catch (HttpError) {
        return HttpError.status
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function pushTemplateRemote(token: string,
    username: string,
    templateHttp: string,
    dir: string,
    url: string) {
    // we clone template, "reinit" it and push to the new origin
    await git.clone({ fs, http, dir: dir, url: templateHttp })
    fs.rmSync(path.join(dir, '.git'), { recursive: true, force: true });

    await git.addRemote({ fs, dir: dir, remote: 'origin', url: url })
    await git.push({
        fs, http, dir: dir, remote: 'origin', ref: 'master',
        onAuth: () => ({ username: username, password: token }),
    })

}

export async function listRepos(token: string): Promise<{ name: string, url: string }[]> {
    const octokit = new Octokit({ auth: token })
    let i = 1
    const res = await octokit.request('GET /user/repos?per_page=100&page=1', {})
    const repoNames = res.data.map(repo => ({ name: repo.name, url: repo.clone_url }))
    while (repoNames.length === 100) {
        i += 1
        const res = await octokit.request(`GET /user/repos?per_page=100&page=${i}`, {})
        repoNames.push(...res.data.map(repo => ({ name: repo.name, url: repo.clone_url })))
    }
    return repoNames
}

export async function clone(repoName: string, gitHubLogin: string, token: string): Promise<number> {
    const url = `https://github.com/${gitHubLogin}/${repoName}.git`
    try {
        await git.clone({
            fs, http, dir: repoName, url: url,
            onAuth: () => ({ username: gitHubLogin, password: token }),
        })
        fs.rmSync(repoName, { recursive: true, force: true });
        return 200
    } catch (HttpError) {
        return HttpError.data.statusCode
    }
}

export async function getRepoStatus(token: string,) {
    const octokit = new Octokit({ auth: token })
    await octokit.request('GET /repos/{owner}/{repo}/commits?page=1', {
        owner: 'OWNER',
        repo: 'REPO'
    })
}

async function makeStartDir(repo: string) {
    await fs.promises.mkdir(repo)
    await fs.promises.writeFile(`${repo}/README.md`, 'first text')
}

async function commit(dir: string,
    commitMessage: string = 'robot',
    author: { name: string, email?: string } = { name: 'robot', }) {
    await git.add({ fs, dir: dir, filepath: '.' })
    await git.commit({ fs, dir: dir, message: commitMessage, author })
}

async function pushFirsCommit(dir: string, token: string) {
    const gitHubLogin = await userLogin(token)
    const url = `https://github.com/${gitHubLogin}/${dir}.git`
    await git.addRemote({ fs, dir: dir, remote: 'origin', url: url })
    await git.push({
        fs, http, dir: dir, remote: 'origin', ref: 'master',
        onAuth: () => ({ username: gitHubLogin, password: token }),
    })
}

function tokenType(token: string): string {
    if (token.includes('github_pat')) return 'fine-grain'
    return 'classic'
}

export async function checkGitHubToken(token: string, repo: string, ): Promise<number> {
    // 409 PushRejectedError { reason: 'not-fast-forward' } undefined
    // 200 ok
    // 403 Forbidden
    // 404 not found(or private and you dont have permission)
    // 401 bad credentials

    makeStartDir(repo)
    await git.init({ fs, dir: repo })
    await commit(repo)
    try {
        await pushFirsCommit(repo, token)
        fs.rmSync(repo, { recursive: true, force: true });
        return 200
    } catch (HttpError) {
        fs.rmSync(repo, { recursive: true, force: true });
        if ('response' in HttpError) {
            return HttpError.response.status
        }
        if (HttpError.code === 'PushRejectedError') {
            return 409 
        }
        console.log(HttpError.data.statusCode)
        return HttpError.data.statusCode
    }
}