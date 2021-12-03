import { useState, useEffect, useReducer, useContext } from 'react'
import { ipcRenderer } from 'electron'
import { SettingsContext } from '../../App'
import ProjectsMenu from './ProjectsMenu'
import ProjectCreate from './ProjectsCreate'
import ProjectMembers from './members/ProjectMembers'
import { fetchProjects } from '../../lib/api/index'
import '../../assets/css/Projects.css'

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
            setNewProject: React.Dispatch<React.SetStateAction<Project[]>>
        }
    }
    | { type: 'home' }

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
        case 'home':
            return { page: null }
    }
}

const Projects = (): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const defaultObj = [{ id: 0, name: "", isclassroom: 0, islocal: false, http: '' }]
    const [projects, setProjects] = useState<Array<Project>>(defaultObj)
    const [state, dispatch] = useReducer(reducer, { page: null });
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
        dispatch({ type: 'home' })
    }

    useEffect(() => {
        fetchProjects(settings, setProjects)
    }, [])

    return (
        <>
            <ProjectsMenu projects={projects}
                removeByProjectID={removeByProjectID}
                setNewProject={setNewProject}
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