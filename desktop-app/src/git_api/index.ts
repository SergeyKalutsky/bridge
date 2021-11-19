import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
const storage = require('electron-json-storage')

const gitDirName = (remote: string, dir: string) => {
  const folders = remote.split('/')
  dir = dir + '/' + folders[folders.length-1].replace('.git', '')
  return dir
}

const options: Partial<SimpleGitOptions> = {
  baseDir: storage.getDataPath(),
  binary: 'git',
  maxConcurrentProcesses: 6,
};

const git: SimpleGit = simpleGit();

const pull = (branches: string[]) => {
  const git: SimpleGit = simpleGit('C:\\Users\\skalutsky\\fluffy-meme', { binary: 'git' });
  for (const branch of branches) {
    git.pull('origin', branch)
  }
}

const dest = 'C:/Users/skalu/AppData/Roaming/my-new-app/storage/'
const remote = 'https://gitlab.bridgeacross.xyz/sergey/Test22.git'

git.clone(remote, gitDirName(remote, dest))

