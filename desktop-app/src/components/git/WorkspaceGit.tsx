import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import '../../assets/css/Workspace.css'
import darkModeStyle from './DiffViewerStyles'


type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type Props = {
  gitDiffs: GitDiff[]
}


const WorkspaceGit = ({ gitDiffs }: Props): JSX.Element => {
  const [diffViewFileIndex, setDiffViewFileIndex] = useState(0)
  const [splitView, setSplitView] = useState(true)


  const diff = gitDiffs[diffViewFileIndex]
  return (
    <div className='workspace'>
      <div className='workspace-background'>
        {/* Tab */}
        <WorkspaceTab setSplitView={setSplitView}
          splitView={splitView}
          gitDiff={gitDiffs}
          setDiffViewFileIndex={setDiffViewFileIndex}
          diffViewFileIndex={diffViewFileIndex} />

        {/* Diff View */}
        <div className='code'>
          <ReactDiffViewer styles={darkModeStyle}
            oldValue={diff.oldFile}
            newValue={diff.newFile}
            splitView={splitView} />
        </div>

      </div>
    </div>
  )
}


export default WorkspaceGit