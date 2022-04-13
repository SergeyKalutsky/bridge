import { useState, useEffect } from 'react'
import GitMenu from './GitMenu'
import WorkspaceGit from './WorkspaceGit'
import { Git } from './types'


const gitDefault = {
  commits: [],
  activeHash: '',
  gitDiffs: [{
    filename: '',
    newFile: '',
    oldFile: ''
  }]
}

const Git = (): JSX.Element => {
  const [git, setGit] = useState<Git>(gitDefault)

  useEffect(() => {
    const setInitGit = async () => {
      setGit({
        ...git,
        commits: await window.git.log()
      })
    }
    setInitGit()
  }, [])
  return (
    <>
      <GitMenu git={git} setGit={setGit} />
      <WorkspaceGit git={git} setGit={setGit} />
    </>
  )
}

export { Git }
