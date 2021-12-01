import '../../assets/css/leftMenu.css'
import { useContext, useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { SettingsContext } from '../../App'
import CommitRow from './CommitRow'

type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type Commit = {
  author_email?: string,
  author_name?: string,
  body?: string,
  date?: string,
  hash?: string,
  message?: string,
  refs?: string,
  activeHashRow?: string,
}

type Props = {
  setGitDiff: React.Dispatch<React.SetStateAction<GitDiff[]>>
}


const GitMenu = ({ setGitDiff }: Props): JSX.Element => {
  const { settings, setSettings } = useContext(SettingsContext)
  const [activeHashRow, setActiveHashRow] = useState<string>()
  const [commitList, setHashList] = useState<Array<Commit>>()

  useEffect(() => {
    const interval = setInterval(() => {
      const hashes = ipcRenderer.sendSync('git', { cmd: 'log', project: settings.active_project })
      setHashList(hashes)
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [])

  const onClickCallback = (hash: string) => {
    const gitDiff = ipcRenderer.sendSync('git', { cmd: 'diff', hash: hash })
    setGitDiff(gitDiff)
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