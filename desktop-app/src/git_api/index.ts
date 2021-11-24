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

const git: SimpleGit = simpleGit()


export { git, settings }