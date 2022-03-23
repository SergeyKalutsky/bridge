import simpleGit, { SimpleGit } from 'simple-git';
import parseGitDiff from './parse';

const git: SimpleGit = simpleGit()



export { git, parseGitDiff }