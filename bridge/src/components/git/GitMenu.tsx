import {ToggleBar, SideMenu, SideMenuHeader} from '../common';
import { GitDiff, Commit } from './types'
import CommitRow from './CommitRow'
import { useState } from 'react'


type Props = {
  setGitDiffs: React.Dispatch<React.SetStateAction<GitDiff[]>>
  commitList: Commit[]
}


const GitMenu = ({ setGitDiffs, commitList }: Props): JSX.Element => {
  const [activeHashRow, setActiveHashRow] = useState<string>()
  const [activeToggle, setActiveToggle] = useState(false)
  const handleToggle = () => { setActiveToggle(!activeToggle) }
  const onClickCallback = (hash: string) => {
    const gitDiffs = window.git.diff(hash)
    setGitDiffs(gitDiffs)
    setActiveHashRow(hash)
  }

  const elements = commitList !== undefined ? commitList.map((commit) =>
    <CommitRow hash={commit.hash}
      key={commit.hash}
      active={activeHashRow === commit.hash}
      onClickCallback={onClickCallback}
    />
  ) : null

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