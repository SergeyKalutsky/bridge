import '../../assets/css/leftMenu.css'
import { useContext, useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { SettingsContext } from '../../App'

type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type Hash = {
  author_email?: string,
  author_name?: string,
  body?: string,
  date?: string,
  hash?: string,
  message?: string,
  refs?: string,
  activeHashRow?: string,
}

type HashElementProp = {
  hash: string
  activeHashRow: string
  setActiveHashRow: React.Dispatch<React.SetStateAction<string>>
  setGitDiff: React.Dispatch<React.SetStateAction<GitDiff[]>>
}

type GitMenuProp = {
  setGitDiff: React.Dispatch<React.SetStateAction<GitDiff[]>>
}


const HashElement = ({ hash,
  setGitDiff,
  activeHashRow,
  setActiveHashRow }: HashElementProp): JSX.Element => {
  return (
    <div className={activeHashRow == hash ? 'git-hash active' : 'git-hash'}
      onClick={() => {
        setActiveHashRow(hash)
        const gitDiff = ipcRenderer.sendSync('git', { cmd: 'diff', hash: hash })
        setGitDiff(gitDiff)
      }}
    >
      <span className='commit'>commit</span>
      <span className='hash'>{hash.substr(0, 8)}</span>
    </div>
  )
}

const GitMenu = ({ setGitDiff }: GitMenuProp): JSX.Element => {
  const { settings, setSettings } = useContext(SettingsContext)
  const [activeHashRow, setActiveHashRow] = useState<string>()
  const [hashList, setHashList] = useState<Array<Hash>>()

  useEffect(() => {
    const interval = setInterval(() => {
      const hashes = ipcRenderer.sendSync('git', { cmd: 'log', project: settings.active_project })
      setHashList(hashes)
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [])

  const elements = hashList !== undefined ? hashList.map((hash) =>
    <HashElement hash={hash.hash}
      key={hash.hash}
      setGitDiff={setGitDiff}
      activeHashRow={activeHashRow}
      setActiveHashRow={setActiveHashRow}
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