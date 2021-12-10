import { useState, useEffect, useReducer, useContext } from 'react'
import { SettingsContext } from '../../App'
import ProjectsMenu from './ProjectsMenu'
import ProjectCreate from './ProjectsCreate'
import { ProjectMembers } from './members/ProjectMembers'
import { fetchProjects } from '../../lib/api/index'
import { mapLocalProject } from '../../lib/helpers'
import '../../assets/css/Projects.css'
const { ipcRenderer } = window.require('electron');

type Project = {
    id: number
    name: string
    isclassroom?: number
    islocal: boolean
    http: string
    description?: string
}

type State = {
    page: JSX.Element
}

type Action =
    | { type: 'memberFind', payload: number }
    | { type: 'findProject' }
    | {
        type: 'createProject', payload: {
            addProject: React.Dispatch<React.SetStateAction<Project[]>>
        }
    }
    | { type: 'home' }

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'createProject':
            return {
                page: <ProjectCreate addProject={action.payload.addProject} />
            }
        case 'memberFind':
            return { page: <ProjectMembers project_id={action.payload} /> }
        case 'home':
            return { page: null }
    }
}

const Projects = (): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const defaultObj = [{ id: 0, name: "", isclassroom: 0, islocal: false, http: '' }]
    const [projects, setProjects] = useState<Array<Project>>(defaultObj)
    const [state, dispatch] = useReducer(reducer, { page: null });

    const removeProject = (project_id: number) => {
        const newProjects = []
        for (const project of projects) {
            if (project.id !== project_id) {
                newProjects.push(project)
            }
        }
        setProjects(newProjects)
    }

    const addProject = (project: Project) => {
        ipcRenderer.send('git', { cmd: 'clone', project: project, user: settings.user })
        project.islocal = true
        setProjects([...projects, project])
        dispatch({ type: 'home' })
    }

    const updateProjects = (project: Project) => {
        const newProjects = []
        for (const oldProject of projects) {
            if (oldProject.id === project.id) {
                newProjects.push(project)
            } else {
                newProjects.push(oldProject)
            }
        }
        setProjects(newProjects)
    }


    useEffect(() => {
        fetchProjects(settings)
            .then(data => {
                const projects = data.map(project => project)
                console.log(projects)
                setProjects(projects)
            })
    }, [])

    return (
        <>
            <ProjectsMenu projects={projects}
                removeProject={removeProject}
                updateProjects={updateProjects}
                addProject={addProject}
                dispatch={dispatch} />

            <div className='workspace'>
                <div className='workspace-background'>
                    {state.page}
                </div>
            </div>
        </>

    )
}


export { Projects, Project }