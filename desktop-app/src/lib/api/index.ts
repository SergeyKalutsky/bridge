import React from 'react'
import { ipcRenderer } from 'electron'
import fs from 'fs'

interface Settings {
    user?: {
        name?: string
        login?: string
        password?: string
        'X-API-Key'?: string
    }
    active_project?: {
        id: number
        name: string
        isclassroom: number
        isuserowner: number
    }
}

type Project = {
    id: number
    name: string
    isclassroom: number
    islocal: boolean
}

const BASE_URL = 'http://localhost:8000'


const mapLocalProjects = (projects: Project[]) => {
    const basedir = ipcRenderer.sendSync('projects', { cmd: 'getbasedir' })
    fs.readdir(basedir, function (err: Error, files: []) {
        projects.map((project, indx) => {
            if (files.includes(project.name)) {
                project.islocal = true
                projects[indx] = project
                return
            }
            project.islocal = false
            projects[indx] = project
        })
    });
    console.log(projects)
    return projects
}

const fetchProjects = (settings: Settings,
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>): void => {
    fetch(`${BASE_URL}/projects/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': settings['user']['X-API-Key'],
        }
    })
        .then(response => response.json())
        .then(data => setProjects(mapLocalProjects(data['projects'])))


}


export { fetchProjects }