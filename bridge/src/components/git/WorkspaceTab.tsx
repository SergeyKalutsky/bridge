import { Button } from '@material-ui/core';
import { Arrow, Refresh } from '../Icons';
import { useState } from 'react';
import '../../assets/css/WorkspaceTab.css'


type Props = {
  switchBtn: JSX.Element
  dropDown: JSX.Element
}


const WorkspaceTab = ({ switchBtn, dropDown }: Props): JSX.Element => {
  const [autoUpdate, setAutoapdate] = useState(false)

  // useEffect(() => {
  //   if (autoUpdate) {
  //     const interval = setInterval(() => {
  //       ipcRenderer.send('git', { cmd: 'pull', project: settings.active_project })
  //       ipcRenderer.send('git', { cmd: 'push', project: settings.active_project })
  //     }, 1000);
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }
  // }, [autoUpdate])

  return (
      <div className='tab'>
        <div className='workspace-tab'>
          <Button className="BttnP" color="primary"
            onClick={() => {
              // ipcRenderer.send('git', { cmd: 'pull', project: settings.active_project })
            }}>
            <span>PULL</span>
            <Arrow />
          </Button>
          <Button className="BttnP" color="secondary"
            onClick={() => {
              // ipcRenderer.send('git', { cmd: 'push', project: settings.active_project })
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
  )
}


export default WorkspaceTab