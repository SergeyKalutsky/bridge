import { Button } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import ArchiveIcon from '@material-ui/icons/Archive';
// import VsCodeIcon from '../assets/visual-studio-code.svg'
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { ipcRenderer } from "electron";

const colortheme = createMuiTheme({
  palette: {
    primary: { main: "#e91e63", contrastText: "#fff" },
    secondary: { main: "#005ff7", contrastText: "#fff" }
  }
});

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    '& svg': {
      fontSize: 50
    },
    'padding-left': 10,
    'color': '#b3afb0'
  }
})
);

type propItem = {
  output: JSX.Element[]
  setOutput: (new_output: JSX.Element[]) => void
}

const WorkspaceBar = ({ output, setOutput }: propItem) => {
  const classes = useStyles()

  ipcRenderer.on('stdout', (event, arg) => {
    setOutput([...output, <p key={output.length}>{'>>> '+arg}</p>]);
  })

  const installFunc = () => {
    const modules = ['notepadplusplus.install']
    for (const module of modules) {
      ipcRenderer.send('cmd', module)
    }
  }

  return (
    <MuiThemeProvider theme={colortheme}>
      <div className='workspace-tab'>
        <IconButton className={classes.menuIcon} onClick={() => { installFunc() }}>
          <ArchiveIcon />
        </IconButton>
        {/* <img src={VsCodeIcon} alt="VsCodeIcon" /> */}
        <Button color="primary">Pull</Button>
        <Button color="secondary">Push</Button>
      </div>
    </MuiThemeProvider>
  )
}


export default WorkspaceBar