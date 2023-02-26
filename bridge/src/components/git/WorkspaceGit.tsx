import { Workspace, ToolBar, IconButton } from "../common";
// import { HiRefresh } from 'react-icons/hi'
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import darkModeStyle from './DiffViewerStyles'
import { Git } from './types'
import Switch from "react-switch";
import DropDown from './DropDown';

function BroseFilesButton({ git, setGit }: {
  git: Git;
  setGit: React.Dispatch<React.SetStateAction<Git>>;
}): JSX.Element {
  const history = useHistory()
  async function handleClick() {
    // const args = { oid: git.oids[0], oid_prev: git.activeOid };
    await window.git.checkoutBranch({ branch: git.activeOid });
    history.push('/commithistory')
    // window.settings.del('userProjects.activeProject.activePath');
    // setGit({
    //   ...git,
    //   oids: await window.git.log()
    // });
  }
  return (
    <div className="w-1/4 flex justify-start items-center" onClick={handleClick}>
      <div className="ml-10 flex items-center justify-center w-[200px] h-[40px] hover:cursor-pointer rounded-lg hover:bg-zinc-800/60 pl-2 pr-2 pt-1 pb-1">
        <span className="text-slate-100 grow text-lg font-medium text-ellipsis whitespace-nowrap truncate">Посмотреть файлы</span>
      </div>
    </div>
  )
}



export default function WorkspaceGit({ git, setGit }: {
  git: Git;
  setGit: React.Dispatch<React.SetStateAction<Git>>;
}): JSX.Element {
  const [diffViewFileIndex, setDiffViewFileIndex] = useState(0);
  const [splitView, setSplitView] = useState(true);

  useEffect(() => {
    setDiffViewFileIndex(0);
  }, [git.gitDiffs]);


  const diff = git.gitDiffs[diffViewFileIndex];
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
                onChange={() => { setSplitView(splitView ? false : true); }}
                offColor={'#2b25cf'}
                onColor={'#0f9100'}
                offHandleColor={'#C7C3C3'}
                onHandleColor={'#C7C3C3'}
                checked={splitView} />
              <BroseFilesButton git={git} setGit={setGit} />
              {/* <IconButton onClick={handleIconClick}>
                <HiRefresh style={{ color: '#ffffff', height: 30, width: 30 }} />
              </IconButton> */}
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
  );
}
