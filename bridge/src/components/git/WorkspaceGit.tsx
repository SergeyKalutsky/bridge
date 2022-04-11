import { useEffect, useState } from 'react';
import Workspace from '../common/Workspace'
import ReactDiffViewer from 'react-diff-viewer';
import ToolBar from '../common/ToolBar'
import darkModeStyle from './DiffViewerStyles'
import { GitDiff } from './types'
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
  }, [gitDiffs])

  const diff = gitDiffs[diffViewFileIndex]

  return (
    <Workspace>
      <ToolBar>
        <div className='flex justify-start items-center w-full h-[30px]'>
          <div className='flex justify-between items-center w-[300px] ml-10'>
          <DropDown gitDiffs={gitDiffs}
            diffViewFileIndex={diffViewFileIndex}
            setDiffViewFileIndex={setDiffViewFileIndex} />
          <Switch
            onChange={() => { setSplitView(splitView ? false : true) }}
            offColor={'#2b25cf'}
            onColor={'#0f9100'}
            offHandleColor={'#C7C3C3'}
            onHandleColor={'#C7C3C3'}
            checked={splitView} />
            </div>
        </div>
      </ToolBar>

      <div className='overflow-scroll h-[calc(100%-30px)]'>
        <ReactDiffViewer styles={darkModeStyle}
          oldValue={diff !== undefined ? diff.oldFile : ''}
          newValue={diff !== undefined ? diff.newFile : ''}
          splitView={splitView} />
      </div>

    </Workspace>
  )
}


export default WorkspaceGit