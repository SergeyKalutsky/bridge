import { useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import WorkspaceTab from './WorkspaceTab'
import '../../assets/css/Workspace.css'
import darkModeStyle from './DiffViewerStyles'
import { GitDiff } from './Git'
import Switch from "react-switch";
import DropDown from './DropDown';


type Props = {
  gitDiffs: GitDiff[]
}


const WorkspaceGit = ({ gitDiffs }: Props): JSX.Element => {
  const [diffViewFileIndex, setDiffViewFileIndex] = useState(0)
  const [splitView, setSplitView] = useState(true)

  useEffect(() => {
    setDiffViewFileIndex(0)
    console.log('here')
  }, [gitDiffs])

  const diff = gitDiffs[diffViewFileIndex]
  const switchBtn = (
    <Switch className='switch'
      onChange={() => {
        setSplitView(splitView == true ? false : true)
      }}
      checked={splitView} />
  )
  const dropDown = (
    <DropDown gitDiffs={gitDiffs}
      diffViewFileIndex={diffViewFileIndex}
      setDiffViewFileIndex={setDiffViewFileIndex} />
  )
  return (
    <div className='workspace'>
      <div className='workspace-background'>
        <WorkspaceTab
          switchBtn={switchBtn}
          dropDown={dropDown} />

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