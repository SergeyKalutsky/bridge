import { Button } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import Switch from "react-switch";
import { Arrow, Refresh } from '../Icons';
import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../../App';
import '../../assets/css/WorkspaceTab.css'

const colortheme = createMuiTheme({
  palette: {
    primary: { main: "#e91e63", contrastText: "#fff" },
    secondary: { main: "#005ff7", contrastText: "#fff" }
  }
});


type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type WorkspaceTabProp = {
  setDiffViewFileIndex?: React.Dispatch<React.SetStateAction<number>>
  setSplitView?: React.Dispatch<React.SetStateAction<boolean>>
  diffViewFileIndex: number
  splitView?: boolean
  gitDiff: GitDiff[]
}

const DropDown = ({ gitDiff,
  setDiffViewFileIndex,
  diffViewFileIndex }: WorkspaceTabProp) => {
  const [selectedClient, setSelectedClient] = useState(diffViewFileIndex);

  const options = gitDiff.map((diff, indx) =>
    <option value={indx} key={diff.filename}>
      {diff.filename}
    </option>
  )
  
  useEffect(() => { setSelectedClient(diffViewFileIndex) })
  return (
    <div className='dropdown'>
      <select name="select" value={selectedClient}
        onChange={(e) => {
          const index = Number(e.target.value);
          setSelectedClient(index)
          setDiffViewFileIndex(index);
        }}>
        {options}
      </select>
    </div>
  )
}

const WorkspaceTab = ({ setSplitView,
  splitView,
  gitDiff,
  setDiffViewFileIndex, diffViewFileIndex }: WorkspaceTabProp): JSX.Element => {
  const { settings, setSettings } = useContext(SettingsContext)
  const [autoUpdate, setAutoapdate] = useState(false)

  useEffect(() => {
    if (autoUpdate) {
      const interval = setInterval(() => {
        ipcRenderer.send('git', { cmd: 'pull', project: settings.active_project })
        ipcRenderer.send('git', { cmd: 'push', project: settings.active_project })
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [autoUpdate])

  return (
    <MuiThemeProvider theme={colortheme}>
      <div className='tab'>
        <div className='workspace-tab'>
          <Button className="BttnP" color="primary" onClick={() => {
            ipcRenderer.send('git', { cmd: 'pull', project: settings.active_project })
          }}>
            <span>PULL</span>
            <Arrow />
          </Button>
          <Button className="BttnP" color="secondary" onClick={() => {
            ipcRenderer.send('git', { cmd: 'push', project: settings.active_project })
          }}>
            <span>PUSH</span>
            <div className="ArrUp">
              <Arrow />
            </div>
          </Button>
          <Button className={autoUpdate == true ? 'auto-update auto-update-on' : 'auto-update'}
            onClick={() => {
              setAutoapdate(autoUpdate == true ? false : true)
            }} >
            <Refresh />
          </Button>
          <DropDown gitDiff={gitDiff}
            diffViewFileIndex={diffViewFileIndex}
            setDiffViewFileIndex={setDiffViewFileIndex} />
          <Switch className='switch'
            onChange={() => {
              splitView == true ? setSplitView(false) : setSplitView(true)
            }}
            checked={splitView} />
        </div>
      </div>
    </MuiThemeProvider>
  )
}


export default WorkspaceTab