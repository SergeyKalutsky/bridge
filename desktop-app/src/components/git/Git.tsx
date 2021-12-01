import { useState, useEffect, useContext } from 'react'
import { ipcRenderer } from 'electron'
import GitMenu from './GitMenu'
import WorkspaceGit from './WorkspaceGit'
import { SettingsContext } from '../../App'

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
  const { settings, setSettings } = useContext(SettingsContext)
  const [gitDiffs, setGitDiffs] = useState<GitDiff[]>(emptyDiff)
  const [commitList, setCommitList] = useState<Commit[]>()

  useEffect(() => {
    const interval = setInterval(() => {
      const commits = ipcRenderer.sendSync('git', { cmd: 'log', project: settings.active_project })
      setCommitList(commits)
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [])
  return (
    <>
      <GitMenu setGitDiffs={setGitDiffs} commitList={commitList}/>
      <WorkspaceGit gitDiffs={gitDiffs}/>
    </>
  )
}

export {Git, GitDiff, Commit}