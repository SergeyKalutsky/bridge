import simpleGit, { SimpleGitOptions } from 'simple-git';

const options: Partial<SimpleGitOptions> = {
    binary: 'git',
    maxConcurrentProcesses: 6,
};

const git = simpleGit(options)
git.submoduleAdd('https://gitlab.bridgeacross.xyz/sergey/test2222.git', 'test/test23')