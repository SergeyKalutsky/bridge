import '../../assets/css/leftMenu.css'
import { useEffect } from 'react'


const GitMenu = (): JSX.Element => {
  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text-feed'>ЛЕНТА</span>
      </div>
      <div className='git-hash-list'>
        <div className='git-hash'>
        </div>
        <div className='git-hash'>
        </div>
        <div className='git-hash'>
        </div>
        <div className='git-hash'>
        </div>
      </div>
    </div>
  )
}

export default GitMenu