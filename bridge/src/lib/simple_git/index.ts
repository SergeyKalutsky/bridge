import simpleGit, { SimpleGit } from 'simple-git';
import parseGitDiff from './parse';

const git: SimpleGit = simpleGit(
    {
        binary: 'C:\\Program Files\\Git\\cmd\\git.exe'
    }
)



export { git, parseGitDiff }