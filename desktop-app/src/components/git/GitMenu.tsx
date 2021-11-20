import '../../assets/css/leftMenu.css'
import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { CollectionsOutlined } from '@material-ui/icons'


type Hash = {
  author_email?: string,
  author_name?: string,
  body?: string,
  date?: string,
  hash: string,
  message?: string,
  refs?: string
}

const HashElement = ({ hash }: Hash): JSX.Element => {
  return (
    <div className='git-hash'>
      <span className='commit'>commit</span>
      <span className='hash'>{hash.substr(0, 8)}</span>
    </div>
  )
}

const GitMenu = (): JSX.Element => {
  const [hashList, setHashList] = useState<Array<Hash>>()
  useEffect(() => {
    const hashes = ipcRenderer.sendSync('git-log', '')['all']
    setHashList(hashes)
  }, [])
  const elements = hashList !== undefined ? hashList.map((hash) =>
    <HashElement hash={hash.hash} key={hash.hash} />
  ) : null
  return (
    <div className='left-menu'>
      <div className='tab-header'>
        <span className='tab-text-feed'
          onClick={() => {
            const hashes = ipcRenderer.sendSync('git-log', '')['all']
            setHashList(hashes)
            console.log(hashes)
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