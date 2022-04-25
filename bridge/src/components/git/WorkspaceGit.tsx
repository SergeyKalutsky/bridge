import { Workspace, ToolBar, IconButton } from "../common";
import { HiRefresh } from 'react-icons/hi'
import { useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import darkModeStyle from './DiffViewerStyles'
import { Git } from './types'
import Switch from "react-switch";
import DropDown from './DropDown';

type Props = {
  git: Git
  setGit: React.Dispatch<React.SetStateAction<Git>>
}

const WorkspaceGit = ({ git, setGit }: Props): JSX.Element => {
  const [diffViewFileIndex, setDiffViewFileIndex] = useState(0)
  const [splitView, setSplitView] = useState(true)

  useEffect(() => {
    setDiffViewFileIndex(0)
  }, [git.gitDiffs])

  const handleIconClick = async () => {
    await window.git.revert(git.activeHash)
    window.settings.del('active_project.activePath')
    setGit({
      ...git,
      commits: await window.git.log()
    })
  }

  const diff = git.gitDiffs[diffViewFileIndex]
  return (
    <Workspace>
      <div className='h-full w-[calc(100%-430)] bg-neutral-900 flex flex-col'>
        <ToolBar>
          <div className='flex justify-start items-center w-full h-[30px]'>
            <div className='flex justify-between items-center w-[350px] ml-10'>
              <DropDown gitDiffs={git.gitDiffs}
                diffViewFileIndex={diffViewFileIndex}
                setDiffViewFileIndex={setDiffViewFileIndex} />
              <Switch
                onChange={() => { setSplitView(splitView ? false : true) }}
                offColor={'#2b25cf'}
                onColor={'#0f9100'}
                offHandleColor={'#C7C3C3'}
                onHandleColor={'#C7C3C3'}
                checked={splitView} />
              <IconButton onClick={handleIconClick}>
                <HiRefresh style={{ color: '#ffffff', height: 30, width: 30 }} />
              </IconButton>
            </div>
          </div>
        </ToolBar>

        <div className='overflow-scroll h-[calc(100%-40px)]'>
          <ReactDiffViewer styles={darkModeStyle}
            oldValue={diff !== undefined ? diff.oldFile : ''}
            newValue={diff !== undefined ? diff.newFile : ''}
            splitView={splitView} />
        </div>
      </div>
    </Workspace>
  )
}


export default WorkspaceGit