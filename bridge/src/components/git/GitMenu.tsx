import '../../assets/css/leftMenu.css'
import { useState } from 'react'
import CommitRow from './CommitRow'
import {GitDiff, Commit} from './Git'


type Props = {
  setGitDiffs: React.Dispatch<React.SetStateAction<GitDiff[]>>
  commitList: Commit[]
}


const GitMenu = ({ setGitDiffs, commitList }: Props): JSX.Element => {
  const [activeHashRow, setActiveHashRow] = useState<string>()

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
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text-feed'>ЛЕНТА</span>
      </div>
      <div className='git-hash-list'>
        {elements}
      </div>
    </div>
  )
}

export default GitMenu