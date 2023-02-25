/* eslint-disable import/no-named-as-default-member */
import git, { GetRemoteInfoResult } from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
import { Octokit } from "@octokit/core"
import path from 'path'

function Utf8ArrayToStr(array) {
    let out, i, c;
    let char2, char3;

    out = "";
    const len = array?.length ? array.length : 0;
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


export async function getFileChanges(dir: string, oid: string, oid_prev: string) {
    const imgExt = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp']
    const A = git.TREE({ ref: oid })
    const B = git.TREE({ ref: oid_prev })
    // Get a list of the files that changed
    const fileChanges = []
    await git.walk({
        fs: fs,
        dir: dir,
        trees: [A, B],
        map: async function (filename, [A, B]) {
            const arr = filename.split('.')
            const ext = arr[arr.length - 1]

            if (A === null) {
                fileChanges.push({
                    filename: filename,
                    newFile: '',
                    oldFile: imgExt.includes(ext) ? 'raw bytes++' : Utf8ArrayToStr(await B.content())
                })
                return
            }

            if (await A.type() === 'tree')
                return

            if (B === null) {
                fileChanges.push({
                    filename: filename,
                    newFile: imgExt.includes(ext) ? 'raw bytes++' : Utf8ArrayToStr(await A.content()),
                    oldFile: ''
                })
                return
            }
            if (await A.oid() === await B.oid())
                return
            fileChanges.push({
                filename: filename,
                newFile: Utf8ArrayToStr(await A.content()),
                oldFile: Utf8ArrayToStr(await B.content())
            })

        }
    })
    return fileChanges
}

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

export async function status(dir: string) {
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
        .filter(row => row[HEAD] !== row[WORKDIR] || row[HEAD] !== row[STAGE])

    return statusMatrix.map(row => statusMapping[row.slice(1).join("")] + ": " + row[FILE])
}


export async function getOids(dir: string, branch: string) {
    const commits = await git.log({
        fs,
        dir: dir,
        ref: branch
    })
    const oids = commits.map(commit => commit.oid)
    return oids
}

async function remoteInfo(url: string): Promise<GetRemoteInfoResult> {
    const info = await git.getRemoteInfo({
        http,
        url: url
    });
    return info
}

export async function headPositonLocal(branch: string, url: string, dir: string): Promise<string> {
    const info = await remoteInfo(url)
    const remoteHead = info.refs.heads[branch]
    const oids = await getOids(dir, branch)
    if (oids[0] === remoteHead) return 'even'
    if (!oids.includes(remoteHead)) return 'behind'
    return 'ahead'
}


export async function pullForce({ dir, branch, url, author }:
    {
        dir: string;
        branch: string;
        url: string;
        author: { name: string; email: string; };
    }): Promise<void> {
    // We always pull force to avoid merge conflicts
    // First I do not believe the kids and beginners are capable of resolving them
    // Second the logic of the repo is 1 superuser and branch users
    // Superuser has the ability to override everyone on their respective branches.
    // In other words the conflict with itself on the branch is impossible, and the conflict with
    // superuser should'nt be possible.
    // This is a simpler way to callaborate.
    await git.fetch({
        fs, http, dir: dir, url: url, ref: branch,
        singleBranch: true,
        tags: false
    })
    try {
        await git.merge({ fs, dir, ours: branch, theirs: `remotes/origin/${branch}`, author })
        await git.checkout({ fs, dir: dir, ref: branch })
    } catch (e) {
        const oidsRemote = await getOids(dir, `remotes/origin/${branch}`)
        const oidsLocal = await getOids(dir, branch)
        for (const oid of oidsRemote) {
            if (oidsLocal.includes(oid)) {
                await git.checkout({ fs, dir: dir, ref: oid })
                await git.deleteBranch({ fs, dir: dir, ref: branch })
                await git.branch({ fs, dir: dir, ref: branch })
                await git.merge({ fs, dir, ours: branch, theirs: `remotes/origin/${branch}`, author })
                await git.checkout({ fs, dir: dir, ref: branch })
                break
            }
        }
    }
}


export async function add(dir: string) {
    const statusMatrix = await status(dir)
    for (const stat of statusMatrix) {
        if (stat.includes('deleted') && stat.includes('unstaged')) {
            const [_, file] = stat.split(': ')
            await git.remove({ fs, dir, filepath: file })
        }
    }
    await git.add({ fs, dir: dir, filepath: '.' })
}



async function main() {
    const dir = '/Users/sergeykalutsky/Library/Application Support/bridge/storage/guest/test'
    const oids = await getOids(dir, 'master')
    const changes = await getFileChanges(dir, oids[0], oids[1])
    console.log(changes)
    // await add(dir)

}
main()