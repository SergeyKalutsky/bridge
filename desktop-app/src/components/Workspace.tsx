import WorkspaceTab from './WorkspaceTab'
import Console from './Console'



// https://github.com/praneshr/react-diff-viewer#readme unified verision
// use for diff viewing

// https://commonmark.org/help/
// this is for task editing
// https://github.com/remarkjs/react-markdown

const Workspace = (): JSX.Element => {
    return (
        <div className='workspace'>
        <div className='workspace-background'>
          <WorkspaceTab />
          <Console />
        </div>
      </div>
    )
}

export default Workspace