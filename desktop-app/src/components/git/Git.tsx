import GitMenu from './GitMenu'
import WorkspaceGit from './Workspace'
import fs from 'fs'
import path from 'path'
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

const initGit = () => {
  const settings = JSON.parse(window.sessionStorage.getItem('settings'))
  if (settings !== null) {
    const project_dir = path.join(settings['data_storage'], settings['active_project']['name'])
    const remote = `https://gitlab.bridgeacross.xyz/${settings['user']['login']}/${settings['active_project']['name']}.git`

    if (!fs.existsSync(project_dir)) {
      const git: SimpleGit = simpleGit();
      git.clone(remote, project_dir)
    }
    const options: Partial<SimpleGitOptions> = {
      baseDir: project_dir,
      binary: 'git',
      maxConcurrentProcesses: 6,
    };
    return simpleGit(options)
  }
  return simpleGit()
}


const Git = () => {
  const git: SimpleGit = initGit()
  return (
    <>
      <GitMenu />
      <WorkspaceGit git={git} />
    </>
  )
}

export default Git