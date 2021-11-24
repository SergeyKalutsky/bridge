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

const git: SimpleGit = undefined

const clone = (data: settings, git: SimpleGit): void => {
  if (data !== null && 'active_project' in data) {
    const project_dir = path.join(data['data_storage'], data['active_project']['name'])
    const project_git = data['active_project']['name'].replace(/ /g, '-')
    const remote = `https://gitlab.bridgeacross.xyz/${data['user']['login']}/${project_git}.git`
    git.cwd(project_dir).clone(remote)
  }
}



export { clone, git, settings }