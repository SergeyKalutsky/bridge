import { useState } from 'react'
import GitMenu from './GitMenu'
import WorkspaceGit from './Workspace'


type ActiveHash = {
  hash: string
}

const Git = () => {
  const [activeHash, setActiveHash] = useState<ActiveHash>()
  return (
    <>
      <GitMenu  setActiveHash={setActiveHash}/>
      <WorkspaceGit activeHash={activeHash}/>
    </>
  )
}

export default Git