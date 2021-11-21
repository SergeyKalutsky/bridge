import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import '../../assets/css/Workspace.css'


type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type WorkspaceGitProp = {
  gitDiff: GitDiff
}

const WorkspaceGit = ({ gitDiff }: WorkspaceGitProp): JSX.Element => {
  const [splitView, setSplitView] = useState(true)
  return (
    <div className='workspace'>
      <div className='workspace-background'>
        <WorkspaceTab setSplitView={setSplitView} splitView={splitView}/>
        <div className='code'>
          <ReactDiffViewer oldValue={gitDiff.oldFile} newValue={gitDiff.newFile} splitView={splitView} />
        </div>
      </div>
    </div>
  )
}



export default WorkspaceGit