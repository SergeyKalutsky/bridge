import React from 'react'

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
    http: string
    description?: string
}

const BASE_URL = 'http://localhost:8000'


const fetchProjects = (settings: Settings,
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>): void => {
    fetch(`${BASE_URL}/projects/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': settings['user']['X-API-Key'],
        }
    })
        .then(response => response.json())
        .then(data => setProjects(data))

}

const deleteMember = (settings: Settings,
    project_id: number,
    user_id: number): void => {
    fetch(`${BASE_URL}/members/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': settings['user']['X-API-Key'],
        },
        body: JSON.stringify({ project_id: project_id, user_id: user_id })
    })
}

const createProject = (settings: Settings,
    project: Project,
    setNewProject: React.Dispatch<React.SetStateAction<Project[]>>): void => {
    fetch(`${BASE_URL}/projects/create`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings['user']['X-API-Key'],
            },
            body: JSON.stringify(project)

        })
        .then(response => response.json())
        .then(data => {
            data['status'] == 'created' ?
                setNewProject(data['project']) : console.log(data)
        })
}


export {
    fetchProjects,
    deleteMember,
    createProject
}