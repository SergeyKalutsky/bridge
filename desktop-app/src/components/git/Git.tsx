import { useState } from 'react'
import GitMenu from './GitMenu'
import WorkspaceGit from './Workspace'

type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}


const Git = () => {
  const [gitDiff, setGitDiff] = useState<GitDiff>({ filename: '', newFile: '', oldFile: '' })
  return (
    <>
      <GitMenu  setGitDiff={setGitDiff}/>
      <WorkspaceGit gitDiff={gitDiff}/>
    </>
  )
}

export default Git