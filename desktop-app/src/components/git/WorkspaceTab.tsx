import { Button } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import ArchiveIcon from '@material-ui/icons/Archive';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { ipcRenderer } from "electron";
import { SimpleGit } from 'simple-git';
import '../../assets/css/WorkspaceTab.css'

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

type GitProp = {
  git: SimpleGit
}

const WorkspaceTab = ({ git }: GitProp) => {
  const classes = useStyles()
  return (
    <MuiThemeProvider theme={colortheme}>
      <div className='workspace-tab'>
        <Button color="primary" onClick={() => {
          if (git != undefined){
            git.pull()
          } else {
            console.log('hasent loaded')
          }
        }}>Pull</Button>
        <Button color="secondary" onClick={() => {
          if (git != undefined){
            git.add('./*').commit('test').push()
          } else {
            console.log('hasent loaded')
          }
        }}>Push</Button>
        <IconButton className={classes.menuIcon} onClick={() => { ipcRenderer.send('cmd', 'test') }}>
          <ArchiveIcon />
        </IconButton>
        {/* <img src={VsCodeIcon} alt="VsCodeIcon" /> */}
      </div>
    </MuiThemeProvider>
  )
}


export default WorkspaceTab