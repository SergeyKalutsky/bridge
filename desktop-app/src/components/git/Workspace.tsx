import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import '../../assets/css/Workspace.css'
import { SimpleGit } from 'simple-git';

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`;
const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
console.log('hello world')
`;

type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}


const WorkspaceGit = (): JSX.Element => {
  const [gitDiff, setGitDiff] = useState<GitDiff>({filename:'', newFile:'', oldFile:''})
  useEffect(() => {
    const gitDiff = ipcRenderer.sendSync('git-diff', '9c1224f18f2e2642b52831f9f44fb94dca87bdd4')
    setGitDiff(gitDiff[0])
  }, [])
  return (
    <div className='workspace'>
      <div className='workspace-background'>
        <WorkspaceTab />
        <div className='code'>
          <ReactDiffViewer oldValue={gitDiff.oldFile} newValue={gitDiff.newFile} splitView={true} />
        </div>
      </div>
    </div>
  )
}



export default WorkspaceGit