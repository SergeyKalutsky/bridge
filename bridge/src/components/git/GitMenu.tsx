import '../../assets/css/leftMenu.css'
import ToggleBar from '../common/ToggleBar';
import SideMenu from '../common/SideMenu';
import SideMenuHeader from '../common/SideMenuHeader';
import { useState } from 'react'
import CommitRow from './CommitRow'
import { GitDiff, Commit } from './Git'


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
        <div className='git-hash-list'>
          {elements}
        </div>
      </SideMenu>
      <ToggleBar handleToggle={handleToggle} />
    </>
  )
}

export default GitMenu