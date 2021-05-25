import WorkspaceTab from './WorkspaceTab'
import Console from './Console'


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