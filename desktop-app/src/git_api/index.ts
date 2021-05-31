import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import simpleGit, { SimpleGit } from 'simple-git';

const init = (remote: string, branch: string): void => {
  let git: SimpleGit = simpleGit();
  const repo = remote.split('/').pop().split('.')[0]
  const repo_path = path.join(os.homedir(), repo)
  git.clone(remote, repo_path)
  git = simpleGit(repo_path, { binary: 'git' })
  git.branch([branch])
  fs.mkdir(path.join(repo_path, branch));
}

// const git: SimpleGit = simpleGit('fluffy-meme', { binary: 'git' });
// console.log(git.pull())
// const pull = (branches: string[])=> {


// }
// console.log(os.homedir())
init('https://github.com/SergeyKalutsky/fluffy-meme.git', 'teacher')