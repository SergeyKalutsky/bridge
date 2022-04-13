import { ToggleBar, SideMenu, SideMenuHeader } from '../common';
import { Git } from './types'
import CommitRow from './CommitRow'
import { useState } from 'react'


type Props = {
  git: Git
  setGit: React.Dispatch<React.SetStateAction<Git>>
}


const GitMenu = ({ git, setGit }: Props): JSX.Element => {
  const [activeToggle, setActiveToggle] = useState(false)
  const handleToggle = () => { setActiveToggle(!activeToggle) }
  const onClickCallback = (hash: string) => {
    const gitDiffs = window.git.diff(hash)
    setGit({
      ...git,
      gitDiffs: gitDiffs,
      activeHash: hash
    })
  }

  const elements = git.commits.map((commit) =>
    <CommitRow hash={commit.hash}
      key={commit.hash}
      active={git.activeHash === commit.hash}
      onClickCallback={onClickCallback}
    />
  )

  return (
    <>
      <SideMenu activeToggle={activeToggle}>
        <SideMenuHeader>
          <span className='text-white text-2xl'>ЛЕНТА</span>
        </SideMenuHeader>
        {elements}
      </SideMenu>
      <ToggleBar handleToggle={handleToggle} />
    </>
  )
}

export default GitMenu