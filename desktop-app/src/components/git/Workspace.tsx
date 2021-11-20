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

type GitProp = {
  git: SimpleGit
}

const WorkspaceGit = ({ git }: GitProp): JSX.Element => {
  return (
    <div className='workspace'>
      <div className='workspace-background'>
        <WorkspaceTab git={git}/>
        <div className='code'>
          <ReactDiffViewer oldValue={oldCode} newValue={newCode} splitView={true} />
        </div>
      </div>
    </div>
  )
}



export default WorkspaceGit