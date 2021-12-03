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
        .then(data => setProjects(data['projects']))

}


export { fetchProjects }