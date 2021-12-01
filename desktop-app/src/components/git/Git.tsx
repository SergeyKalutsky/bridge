import { useState } from 'react'
import GitMenu from './GitMenu'
import WorkspaceGit from './WorkspaceGit'

type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

const emptyDiff = [{ filename: '', newFile: '', oldFile: '' }]

const Git = (): JSX.Element => {
  const [gitDiffs, setGitDiff] = useState<GitDiff[]>(emptyDiff)
  return (
    <>
      <GitMenu setGitDiff={setGitDiff}/>
      <WorkspaceGit gitDiffs={gitDiffs}/>
    </>
  )
}

export default Git