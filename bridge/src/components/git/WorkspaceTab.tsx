import { useState } from 'react';
import '../../assets/css/WorkspaceTab.css'


type Props = {
  switchBtn: JSX.Element
  dropDown: JSX.Element
}


const WorkspaceTab = ({ switchBtn, dropDown }: Props): JSX.Element => {

  return (
    <div className='tab'>
      <div className='workspace-tab'>
        {dropDown}
        {switchBtn}
      </div>
    </div>
  )
}


export default WorkspaceTab