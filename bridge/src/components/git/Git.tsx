import { useState, useEffect } from 'react'
import GitMenu from './GitMenu'
import WorkspaceGit from './WorkspaceGit'

type GitDiff = {
  filename: string
  newFile: string
  oldFile: string
}

type Commit = {
  author_email?: string,
  author_name?: string,
  body?: string,
  date?: string,
  hash?: string,
  message?: string,
  refs?: string,
  activeHashRow?: string,
}

const emptyDiff = [{ filename: '', newFile: '', oldFile: '' }]

const Git = (): JSX.Element => {
  const [gitDiffs, setGitDiffs] = useState<GitDiff[]>(emptyDiff)
  const [commitList, setCommitList] = useState<Commit[]>()

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // const commits = ipcRenderer.sendSync('git', { cmd: 'log', project: window.settings.get().active_project })
  //     // setCommitList(commits)
  //   // }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [])
  return (
    <>
      <GitMenu setGitDiffs={setGitDiffs} commitList={commitList}/>
      <WorkspaceGit gitDiffs={gitDiffs}/>
    </>
  )
}

export {Git, GitDiff, Commit}
