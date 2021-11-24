import { Button } from '@material-ui/core';
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import '../../assets/css/WorkspaceTab.css'
import { ipcRenderer } from 'electron';
import Switch from "react-switch";
import { useEffect, useState } from 'react';

const colortheme = createMuiTheme({
  palette: {
    primary: { main: "#e91e63", contrastText: "#fff" },
    secondary: { main: "#005ff7", contrastText: "#fff" }
  }
});

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    '& svg': {
      fontSize: 30
    },
    'padding-left': 10,
    'color': '#b3afb0'
  }
})
);

type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type WorkspaceTabProp = {
  setDiffViewOption?: React.Dispatch<React.SetStateAction<number>>
  setSplitView?: React.Dispatch<React.SetStateAction<boolean>>
  diffViewOption: number
  splitView?: boolean
  gitDiff: GitDiff[]
}

const DropDown = ({ gitDiff,
  setDiffViewOption,
  diffViewOption }: WorkspaceTabProp) => {
  const [selectedClient, setSelectedClient] = useState(diffViewOption);
  const options = gitDiff.map((diff, indx) =>
    <option value={indx}
      key={diff.filename}>{diff.filename}</option>
  )
  useEffect(() => { setSelectedClient(diffViewOption) })
  return (
    <div className='dropdown'>
      <select name="select" value={selectedClient}
        onChange={(e) => {
          const index = Number(e.target.value);
          setSelectedClient(index)
          setDiffViewOption(index);
        }}>
        {options}
      </select>
    </div>
  )
}

const WorkspaceTab = ({ setSplitView,
  splitView,
  gitDiff,
  setDiffViewOption, diffViewOption }: WorkspaceTabProp): JSX.Element => {
  const classes = useStyles()
  return (
    <MuiThemeProvider theme={colortheme}>
      <div className='workspace-tab'>
        <Button color="primary" onClick={() => {
          ipcRenderer.send('git', { cmd: 'pull' })
        }}>Pull</Button>
        <Button color="secondary" onClick={() => {
          ipcRenderer.send('git', { cmd: 'push' })
        }}>Push</Button>
        <IconButton className={classes.menuIcon}>
          <FontAwesomeIcon icon={faSync} />
        </IconButton>
        <DropDown gitDiff={gitDiff}
          diffViewOption={diffViewOption}
          setDiffViewOption={setDiffViewOption} />
        <Switch className='switch'
          onChange={() => {
            splitView == true ? setSplitView(false) : setSplitView(true)
          }}
          checked={splitView} />
      </div>
    </MuiThemeProvider>
  )
}


export default WorkspaceTab