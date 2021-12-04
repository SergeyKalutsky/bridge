import { Project } from '../../components/projects/Projects'

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


const BASE_URL = 'http://localhost:8000'


const fetchProjects = (settings: Settings): Promise<Response> => {
    return fetch(`${BASE_URL}/projects/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': settings['user']['X-API-Key'],
        }
    })
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

const createProject = (settings: Settings, project: Project): Promise<Response> => {
    return fetch(`${BASE_URL}/projects/create`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings['user']['X-API-Key'],
            },
            body: JSON.stringify(project)
        })
}


export {
    fetchProjects,
    deleteMember,
    createProject
}