import { Button } from '@material-ui/core';
import { createTheme , MuiThemeProvider } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import { Arrow, Refresh } from '../Icons';
import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../../App';
import '../../assets/css/WorkspaceTab.css'

const colortheme = createTheme({
  palette: {
    primary: { main: "#e91e63", contrastText: "#fff" },
    secondary: { main: "#005ff7", contrastText: "#fff" }
  }
});


type Props = {
  switchBtn: JSX.Element
  dropDown: JSX.Element
}


const WorkspaceTab = ({ switchBtn, dropDown }: Props): JSX.Element => {
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
          <Button className="BttnP" color="primary"
            onClick={() => {
              ipcRenderer.send('git', { cmd: 'pull', project: settings.active_project })
            }}>
            <span>PULL</span>
            <Arrow />
          </Button>
          <Button className="BttnP" color="secondary"
            onClick={() => {
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
          {dropDown}
          {switchBtn}
        </div>
      </div>
    </MuiThemeProvider>
  )
}


export default WorkspaceTab