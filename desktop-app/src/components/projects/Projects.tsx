import { useState, useEffect, useReducer, useContext } from 'react'
import { ipcRenderer } from 'electron'
import { SettingsContext } from '../../App'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectCreate from './ProjectsCreate'
import ProjectMembers from './members/ProjectMembers'
import ProjectFind from './ProjectFind'

type Project = {
    id: number
    name: string
    isclassroom: number
    setMember?: any
}

type State = {
    page: JSX.Element
}

type Action =
    | { type: 'memberFind', payload: number }
    | { type: 'findProject' }
    | {
        type: 'createProject', payload: {
            setNewProject:  (project: Project) => void
        }
    }

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'findProject':
            return { page: <ProjectFind /> }
        case 'createProject':
            return {
                page: <ProjectCreate setNewProject={action.payload.setNewProject} />
            }
        case 'memberFind':
            return { page: <ProjectMembers project_id={action.payload} /> }

    }
}

const Projects = (): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const [projects, setProjects] = useState<Array<Project>>([{ id: 0, name: "", isclassroom: 0 }])
    const [state, dispatch] = useReducer(reducer, {
        page: <ProjectCreate setNewProject={null} />
    });

    const removeByProjectID = (project_id: number) => {
        const newProjects = []
        for (const project of projects) {
            if (project.id !== project_id) {
                newProjects.push(project)
            }
        }
        setProjects(newProjects)
    }

    const setNewProject = (project: Project) => {
        ipcRenderer.send('git', { cmd: 'clone', project: project, user: settings.user })
        setProjects([...projects, project])
    }

    useEffect(() => {
        fetch('http://localhost:8000/projects/list', {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings['user']['X-API-Key'],
            }
        })
            .then(response => response.json())
            .then(data => setProjects(data['projects']))
    }, [])

    return (
        <>
            <ProjectsMenu projects={projects}
                projectFuncs={{ removeByProjectID, setNewProject }}
                dispatch={dispatch} />
            <div className='workspace'>
                <div className='workspace-background'>
                    {state.page}
                </div>
            </div>
        </>

    )
}


export { Projects }