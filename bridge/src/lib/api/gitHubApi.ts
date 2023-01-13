import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
import path from 'path'
import { Octokit } from "@octokit/core"

async function tokenAcces(token: string) {
    const octokit = new Octokit({ auth: token });
    try {
        const { data } = await octokit.request("/user");
        const pub = data.public_repos ? data.public_repos : 0
        const priv = data.total_private_repos ? data.total_private_repos : 0
        if (pub + priv > 1) {
            return 'warning'
        }
        return 'fine'
    } catch (httpError) {
        return 'bad_token'
    }
}

async function createRepoAuthToken({ name, token, description, templateHttp, dir }:
    {
        name: string,
        token: string,
        description: string,
        templateHttp: string,
        dir: string,
        url: string
    }): Promise<void> {
    const octokit = new Octokit({ auth: token });
    try {
        const res = await octokit.request('POST /user/repos', {
            name: name,
            description: description,
            homepage: 'https://github.com',
            'private': false,
            is_template: true
        })
        await pushTemplateRemote(token, name, templateHttp, dir, res.url)
    } catch (HttpError) {
        console.log(HttpError)
    }
}

async function pushTemplateRemote(token: string,
    username: string,
    templateHttp: string,
    dir: string,
    url: string) {
    // we clone template, "reinit" it and push to the new origin
    await git.clone({ fs, http, dir: dir, url: templateHttp })
    fs.rmSync(path.join(dir, '.git'), { recursive: true, force: true });
    await git.init({ fs, dir: dir })
    await git.add({ fs, dir: dir, filepath: '.' })
    await git.commit({ fs, dir: dir, message: 'first commit', author: { name: username } })
    await git.addRemote({ fs, dir: dir, remote: 'origin', url: url })
    await git.push({
        fs, http, dir: dir, remote: 'origin', ref: 'master',
        onAuth: () => ({ username: username, password: token }),
    })

}

async function listRepos(token: string): Promise<string[]> {
    const octokit = new Octokit({ auth: token })
    let i = 1
    const res = await octokit.request('GET /user/repos?per_page=100&page=1', {})
    console.log(res)
    const repoNames = res.data.map(repo => repo.name)
    while (repoNames.length === 30) {
        i += 1
        const res = await octokit.request(`GET /user/repos?per_page=100&page=${i}`, {})
        repoNames.push(...res.data.map(repo => repo.name))
    }
    return repoNames

}

async function isBare(url: string) {
    // The logic is simple, if repo is bare it doesn't have any commits
    // so when we clone it and try to get logs it should error out
    await git.clone({ fs, http, dir: 'test', url: url })
    try {
        await git.log({ fs, dir: 'test' })
        fs.rmSync(path.join('test', '.git'), { recursive: true, force: true });
    } catch (error) {
        return true
    }
    fs.rmSync(path.join('test', '.git'), { recursive: true, force: true });
    return false
}
