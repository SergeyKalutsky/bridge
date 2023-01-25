/* eslint-disable import/no-named-as-default-member */
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
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

export async function pushRemote({ token, dir, url }:
    {
        token: string;
        dir: string;
        url: string
    }
): Promise<string> {
    await git.deleteRemote({ fs, dir: dir, remote: 'origin' })
    await git.addRemote({ fs, dir: dir, remote: 'origin', url: url })
    try {
        await git.push({
            fs, http, dir: dir, remote: 'origin', ref: 'master',
            onAuth: () => ({ username: 'guest', password: token }),
        })
        return null
    } catch (e) {
        if (e.name === 'HttpError') {
            if (e?.data?.statusCode === 401) {
                return 'BadToken'
            }
            if (e?.data?.statusCode === 404) {
                return 'NotFound'
            }
            if (e?.data?.statusCode === 403) {
                return 'Forbidden'
            }
        }
        return e.name
    }

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
    commitMessage: 'robot',
    author: { name: string, email?: string } = { name: 'robot', }) {
    await git.add({ fs, dir: dir, filepath: '.' })
    await git.commit({ fs, dir: dir, message: commitMessage, author })
}


function tokenType(token: string): string {
    if (token.includes('github_pat')) return 'fine-grain'
    return 'classic'
}


export async function pushTestBranch({ dir, token, git_url }:
    { dir: string; token: string, git_url: string }
): Promise<boolean> {
    const branch = Date.now().toString()
    await git.branch({ fs, dir: dir, ref: branch })
    try {
        await git.push({
            fs, http, dir: dir, url: git_url, remote: 'origin', ref: branch,
            onAuth: () => ({ username: 'robot', password: token }),
        })
        await git.deleteBranch({ fs, dir: dir, ref: branch })
        return true
    } catch (e) {
        await git.deleteBranch({ fs, dir: dir, ref: branch })
        return false
    }
}

async function status(dir: string) {
    const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3

    const statusMapping = {
        "003": "added, staged, deleted unstaged",
        "020": "new, untracked",
        "022": "added, staged",
        "023": "added, staged, with unstaged changes",
        "100": "deleted, staged",
        "101": "deleted, unstaged",
        "103": "modified, staged, deleted unstaged",
        "111": "unmodified",
        "121": "modified, unstaged",
        "122": "modified, staged",
        "123": "modified, staged, with unstaged changes"
    };

    const statusMatrix = (await git.statusMatrix({ fs, dir }))
    //   .filter(row => row[HEAD] !== row[WORKDIR] || row[HEAD] !== row[STAGE])

    return statusMatrix.map(row => statusMapping[row.slice(1).join("")] + ": " + row[FILE])
}

async function localHeads(dir: string) {
    const branches = await git.listBranches({ fs, dir: dir })
    const heads = {}
    for (const branch of branches) {
        const commits = await git.log({
            fs,
            dir: dir,
            depth: 1,
            ref: branch
        })
        heads[branch] = commits[0].oid
    }
    return heads
}

async function main() {
    const dir = '/Users/sergeykalutsky/Library/Application Support/bridge/storage/guest/test2303'
    // await logAllBranches(dir)
    const info = await git.getRemoteInfo({
        http,
        url:
            "https://github.com/SergeyKalutsky/test2303.git"
    });
    console.log(info)
}


// fetch for all branches | fetch does fetch of all branches by default