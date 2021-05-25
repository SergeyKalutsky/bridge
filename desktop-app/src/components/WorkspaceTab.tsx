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

const WorkspaceTab = () => {
  const classes = useStyles()
  return (
    <MuiThemeProvider theme={colortheme}>
      <div className='workspace-tab'>
        <IconButton className={classes.menuIcon} onClick={() => { ipcRenderer.send('cmd', 'test') }}>
          <ArchiveIcon />
        </IconButton>
        {/* <img src={VsCodeIcon} alt="VsCodeIcon" /> */}
        <Button color="primary">Pull</Button>
        <Button color="secondary">Push</Button>
      </div>
    </MuiThemeProvider>
  )
}


export default WorkspaceTab