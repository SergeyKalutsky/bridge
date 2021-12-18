import { Button } from '@material-ui/core';
import { Refresh } from '../Icons';
import { useState, useEffect } from 'react';
import '../../assets/css/WorkspaceTab.css'


type Props = {
  switchBtn: JSX.Element
  dropDown: JSX.Element
}


const WorkspaceTab = ({ switchBtn, dropDown }: Props): JSX.Element => {
  const [autoUpdate, setAutoapdate] = useState(false)

  useEffect(() => {
    if (autoUpdate) {
      const interval = setInterval(() => {
        window.git.pull()
        window.git.push()
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [autoUpdate])

  return (
      <div className='tab'>
        <div className='workspace-tab'>
         
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