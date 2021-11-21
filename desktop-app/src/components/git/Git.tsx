import { useState } from 'react'
import GitMenu from './GitMenu'
import WorkspaceGit from './Workspace'

type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}


const Git = () => {
  const [diffViewOption, setDiffViewOption] = useState(0)
  const [gitDiff, setGitDiff] = useState<GitDiff[]>([{ filename: '', newFile: '', oldFile: '' }])
  return (
    <>
      <GitMenu  setGitDiff={setGitDiff} setDiffViewOption={setDiffViewOption}/>
      <WorkspaceGit gitDiff={gitDiff} 
                    diffViewOption={diffViewOption} 
                    setDiffViewOption={setDiffViewOption}/>
    </>
  )
}

export default Git