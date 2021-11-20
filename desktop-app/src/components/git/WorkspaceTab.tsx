import { Button } from '@material-ui/core';
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { SimpleGit } from 'simple-git';
import '../../assets/css/WorkspaceTab.css'
import { ipcRenderer } from 'electron';

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

type GitProp = {
  git: SimpleGit
}

const WorkspaceTab = ({ git }: GitProp) => {
  const classes = useStyles()
  return (
    <MuiThemeProvider theme={colortheme}>
      <div className='workspace-tab'>
        <Button color="primary" onClick={() => {
          ipcRenderer.send('git-pull', 'pull')
        }}>Pull</Button>
        <Button color="secondary" onClick={() => {
          ipcRenderer.send('git-push', 'push')
        }}>Push</Button>
        <IconButton className={classes.menuIcon}>
          <FontAwesomeIcon icon={faSync} />
        </IconButton>
      </div>
    </MuiThemeProvider>
  )
}


export default WorkspaceTab