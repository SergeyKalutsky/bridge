import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import Console from './Console'
import '../../assets/css/Workspace.css'

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

const WorkspaceGit = (): JSX.Element => {
  return (
    <div className='workspace'>
      <div className='workspace-background'>
        <WorkspaceTab />
        <div className='code'>
          <ReactDiffViewer oldValue={oldCode} newValue={newCode} splitView={true} />
        </div>
        <Console />
      </div>
    </div>
  )
}

const Workspace = (): JSX.Element => {
  return (
    <WorkspaceGit />
  )
}

export default Workspace