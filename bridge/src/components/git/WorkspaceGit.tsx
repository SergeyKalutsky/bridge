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

const getDiffViewWidth = (): number => {
  const sideWidth = JSON.parse(window.localStorage.getItem('sideWidth'))
  return window.innerWidth - sideWidth - 80
}

const WorkspaceGit = ({ git, setGit }: Props): JSX.Element => {
  const [diffViewFileIndex, setDiffViewFileIndex] = useState(0)
  const [splitView, setSplitView] = useState(true)
  const [diffViewWidth, setDiffViewWidth] = useState(getDiffViewWidth())

  useEffect(() => {
    window.shared.incomingData("terminal:fit", (data) => {
      if (data.x !== undefined) {
        setDiffViewWidth(diffViewWidth => diffViewWidth - data.x)
      }
    });
    return () => window.shared.removeListeners("terminal:fit")
  }, [])

  useEffect(() => {
    function updateSize({ target }) {
      setDiffViewWidth(target.innerWidth - JSON.parse(window.localStorage.getItem('sideWidth')) - 80)
    }
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, []);

  useEffect(() => {
    setDiffViewFileIndex(0)
  }, [git.gitDiffs])

  const handleIconClick = ()=>{
    console.log(git)
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

        <div className='overflow-scroll h-[calc(100%-40px)]' style={{ width: diffViewWidth }}>
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