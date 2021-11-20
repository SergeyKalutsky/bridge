import GitMenu from './GitMenu'
import Workspace from './Workspace'
import fs from 'fs'
import path from 'path'
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

const Git = () => {
  const settings = JSON.parse(window.sessionStorage.getItem('settings'))
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
  const git: SimpleGit = simpleGit(options);
  return (
    <>
      <GitMenu />
      <Workspace />
    </>
  )
}

export default Git