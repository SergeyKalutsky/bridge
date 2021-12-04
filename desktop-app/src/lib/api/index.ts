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


const fetchProjects = (settings: Settings): Promise<any> => {
    return fetch(`${BASE_URL}/projects/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': settings['user']['X-API-Key'],
        }
    }).then(response => response.json())
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

const createProject = (settings: Settings, project: Project): Promise<any> => {
    return fetch(`${BASE_URL}/projects/create`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings['user']['X-API-Key'],
            },
            body: JSON.stringify(project)
        })
        .then(response => response.json())
}


const listProjectMembers = (settings: Settings, project_id: number): Promise<any> => {
    return fetch(`http://localhost:8000/members/list?project_id=${project_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings['user']['X-API-Key']
            }
        })
        .then(response => response.json())
}

const addProjectMember = (settings: Settings,
    member_id: number,
    project_id: number) => {
    fetch('http://localhost:8000/members/add',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings['user']['X-API-Key']
            },
            body: JSON.stringify({
                user_id: member_id,
                project_id: project_id
            })
        })
}


const findUser = (settings: Settings, search: string) => {
    return fetch(`http://localhost:8000/users/find`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings['user']['X-API-Key']
            },
            body: JSON.stringify({ name: search })
        })
        .then(response => response.json())
}

export {
    fetchProjects,
    deleteMember,
    createProject,
    listProjectMembers,
    addProjectMember,
    findUser
}