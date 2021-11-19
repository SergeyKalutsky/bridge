import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
const storage = require('electron-json-storage')

const gitDirName = (remote: string, dir: string) => {
  const folders = remote.split('/')
  dir = dir + '/' + folders[folders.length - 1].replace('.git', '')
  return dir
}

const simplePush = (dir: string) => {
  const options: Partial<SimpleGitOptions> = {
    baseDir: dir,
    binary: 'git',
    maxConcurrentProcesses: 6,
  };

  const git: SimpleGit = simpleGit(options);
  git.add('./*')
    .commit('test')
    .push()
}

const pull = (dir: string) => {
  const options: Partial<SimpleGitOptions> = {
    baseDir: dir,
    binary: 'git',
    maxConcurrentProcesses: 6,
  };
  const git: SimpleGit = simpleGit(options);
  git.pull()
}


const dest = 'C:/Users/skalu/AppData/Roaming/my-new-app/storage/'
const remote = 'https://gitlab.bridgeacross.xyz/sergey/Test22.git'

// simplePush(gitDirName(remote, dest))
pull(gitDirName(remote, dest))


// git.clone(remote, gitDirName(remote, dest))


