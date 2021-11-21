import fs from 'fs'
import path from 'path'
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';


type settings = {
  data_storage?: string,
  user?: {
    id: number,
    password: string,
    login: string,
    api_key: string
  },
  active_project?: {
    name: string
    id: string
  }
}

let git: SimpleGit = undefined

const initGit = (data: settings) => {
  if (data !== null && 'active_project' in data) {
    const project_dir = path.join(data['data_storage'], data['active_project']['name'])
    const project_git = data['active_project']['name'].replace(/ /g, '-')
    const remote = `https://gitlab.bridgeacross.xyz/${data['user']['login']}/${project_git}.git`

    const options: Partial<SimpleGitOptions> = {
      baseDir: project_dir,
      binary: 'git',
      maxConcurrentProcesses: 6,
    };
    fs.stat(project_dir, (err, stat) => {
      if (err == null) {
        git = simpleGit(options)
      } else if (err.code == 'ENOENT') {
        simpleGit().clone(remote, project_dir)
          .then(() => git = simpleGit(options))
      }
    })
  }
}

export {initGit, git, settings}