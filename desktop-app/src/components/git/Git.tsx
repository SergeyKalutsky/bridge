import GitMenu from './GitMenu'
import WorkspaceGit from './Workspace'
import fs from 'fs'
import path from 'path'
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import { useEffect, useState } from 'react';

const initGit = (setGit: React.Dispatch<React.SetStateAction<SimpleGit>>) => {
  const settings = JSON.parse(window.sessionStorage.getItem('settings'))
  if (settings !== null && 'active_project' in settings) {
    const project_dir = path.join(settings['data_storage'], settings['active_project']['name'])
    const remote = `https://gitlab.bridgeacross.xyz/${settings['user']['login']}/${settings['active_project']['name']}.git`

    const options: Partial<SimpleGitOptions> = {
      baseDir: project_dir,
      binary: 'git',
      maxConcurrentProcesses: 6,
    };
    fs.stat(project_dir, (err, stat) => {
      if (err == null) {
        setGit(simpleGit(options))
      } else if (err.code == 'ENOENT') {
        const git: SimpleGit = simpleGit();
        git.clone(remote, project_dir)
          .then(() => setGit(simpleGit(options)))
      }
    })
  }
}

const Git = () => {
  const [git, setGit] = useState<SimpleGit>()
  useEffect(() => { initGit(setGit) })
  return (
    <>
      <GitMenu />
      <WorkspaceGit git={git} />
    </>
  )
}

export default Git