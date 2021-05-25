import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import Console from './Console'



// https://github.com/praneshr/react-diff-viewer#readme unified verision
// use for diff viewing

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

// https://commonmark.org/help/
// this is for task editing
// https://github.com/remarkjs/react-markdown

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