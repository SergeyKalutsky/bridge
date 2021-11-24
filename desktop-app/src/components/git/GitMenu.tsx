import '../../assets/css/leftMenu.css'
import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

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
  setDiffViewOption: React.Dispatch<React.SetStateAction<number>>
}

type GitMenuProp = {
  setGitDiff: React.Dispatch<React.SetStateAction<GitDiff[]>>
  setDiffViewOption: React.Dispatch<React.SetStateAction<number>>
}


const HashElement = ({ hash,
  setGitDiff,
  activeHashRow,
  setActiveHashRow,
  setDiffViewOption }: HashElementProp): JSX.Element => {
  return (
    <div className={activeHashRow == hash ? 'git-hash active' : 'git-hash'}
      onClick={() => {
        setActiveHashRow(hash)
        const gitDiff = ipcRenderer.sendSync('git', { cmd: 'diff', hash: hash })
        setGitDiff(gitDiff)
        setDiffViewOption(0)
      }}
    >
      <span className='commit'>commit</span>
      <span className='hash'>{hash.substr(0, 8)}</span>
    </div>
  )
}

const GitMenu = ({ setGitDiff, setDiffViewOption }: GitMenuProp): JSX.Element => {
  const [activeHashRow, setActiveHashRow] = useState<string>()
  const [hashList, setHashList] = useState<Array<Hash>>()
  useEffect(() => {
    const interval = setInterval(() => {
      const hashes = ipcRenderer.sendSync('git', { cmd: 'log' })['all']
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
      setDiffViewOption={setDiffViewOption}
    />
  ) : null
  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text-feed'
          onClick={() => {
            const hashes = ipcRenderer.sendSync('git', { cmd: 'log' })['all']
            setHashList(hashes)
          }}
        >ЛЕНТА</span>
      </div>
      <div className='git-hash-list'>
        {elements}
      </div>
    </div>
  )
}

export default GitMenu