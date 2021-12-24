import { useState, useEffect, useReducer } from 'react'
import ToggleBar from '../common/ToggleBar';
import IconButton from '../common/IconButton';
import ProjectItem from './ProjectItem';
import SideMenu from '../common/SideMenu';
import SideMenuHeader from '../common/SideMenuHeader';
import Workspace from '../common/Workspace'
import ProjectCreate from './ProjectsCreate'
import ProjectMembers from './members/ProjectMembers'
import { fetchProjects } from '../../lib/api/index'
import { Adding } from '../common/Icons';
import { Project } from './types';



type State = {
    page: JSX.Element
}

type Action =
    | { type: 'memberFind', payload: number }
    | { type: 'createProject', payload: { addProject: (project: Project) => void } }
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
    const defaultObj = [{ id: 0, name: "", isclassroom: 0, islocal: false, http: '' }]
    const [projects, setProjects] = useState<Array<Project>>(defaultObj)
    const [state, dispatch] = useReducer(reducer, { page: null });
    const [activeToggle, setActiveToggle] = useState(false)
    const handleToggle = () => { setActiveToggle(!activeToggle) }

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
        window.git.clone(project)
        project.islocal = true
        setProjects([...projects, project])
        dispatch({ type: 'home' })
    }

    const setActiveProject = (project_id: number) => {
        const newProjects = []
        for (const project of projects) {
            if (project.id === project_id) {
                project.isactive = true
            } else {
                project.isactive = false
            }
            newProjects.push(project)
        }
        setProjects(newProjects)
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
        const localProjects = window.projects.getLocalProjectsNames()
        const settings = window.settings.get()
        fetchProjects(window.settings.get())
            .then(data => {
                const projects = data.map((project: Project) => {
                    project.islocal = localProjects.includes(project.name)
                    project.isactive = settings.active_project !== undefined && settings.active_project.id == project.id
                    return project
                })
                setProjects(projects)
            })
    }, [])

    const projects_list = projects.map((project) =>
        <ProjectItem project={project}
            key={project.id}
            dispatch={dispatch}
            removeProject={removeProject}
            updateProjects={updateProjects}
            setActiveProject={setActiveProject} />
    )
    return (
        <>
            <SideMenu activeToggle={activeToggle}>
                <SideMenuHeader>
                    <span className='text-white text-3xl'>ПРОЕКТЫ</span>
                    <IconButton width={8} height={8}
                        onClick={() => {
                            dispatch({ type: 'createProject', payload: { addProject: addProject } })
                        }}>
                        <Adding />
                    </IconButton >
                </SideMenuHeader>
                {projects_list}
            </SideMenu>
            <ToggleBar handleToggle={handleToggle} />
            <Workspace>
                {state.page}
            </Workspace>
        </>

    )
}


export default Projects 