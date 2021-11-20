import GitMenu from './GitMenu'
import WorkspaceGit from './Workspace'
import { SimpleGit } from 'simple-git';
import { useEffect, useState } from 'react';


const Git = () => {
  const [git, setGit] = useState<SimpleGit>()
  // useEffect(() => { initGit(setGit) })
  return (
    <>
      <GitMenu git={git} />
      <WorkspaceGit git={git} />
    </>
  )
}

export default Git