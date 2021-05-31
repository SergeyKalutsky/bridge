import {promises as fs} from 'fs'
import simpleGit, { SimpleGit } from 'simple-git';



const init = (remote: string, branch: string): void => {
  const git: SimpleGit = simpleGit();
  git.clone(remote)
  git.branch([branch])
  const repo_dir = remote.split('/').pop().split('.')[0]
  fs.mkdir(`./${repo_dir}/${branch}`, { recursive: true });
}

init('https://github.com/SergeyKalutsky/fluffy-meme.git', 'teacher')