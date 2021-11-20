import '../../assets/css/leftMenu.css'
import { SimpleGit } from 'simple-git'
import { useEffect } from 'react'

type GitProp = {
  git: SimpleGit
}

const GitMenu = ({ git }: GitProp): JSX.Element => {
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