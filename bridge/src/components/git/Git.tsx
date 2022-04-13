import { useState, useEffect } from 'react'
import GitMenu from './GitMenu'
import WorkspaceGit from './WorkspaceGit'
import { Commit, GitDiff } from './types'

const emptyDiff = [{ filename: '', newFile: '', oldFile: '' }]

interface Git {
  
}

// gitDefault = {

// }

const Git = (): JSX.Element => {
  const [gitDiffs, setGitDiffs] = useState<GitDiff[]>(emptyDiff)
  const [commitList, setCommitList] = useState<Commit[]>()

  useEffect(() => {
    const commits = window.git.log()
    setCommitList(commits)
  }, [])
  return (
    <>
      <GitMenu setGitDiffs={setGitDiffs} commitList={commitList} />
      <WorkspaceGit gitDiffs={gitDiffs} />
    </>
  )
}

export { Git }
