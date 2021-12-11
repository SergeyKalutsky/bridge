import { useState, useEffect, useReducer } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ProjectItem from './ProjectItem';
import ProjectsMenu from './ProjectsMenu'
import ProjectCreate from './ProjectsCreate'
import { ProjectMembers } from './members/ProjectMembers'
import { fetchProjects } from '../../lib/api/index'
import { Adding } from '../Icons';
import '../../assets/css/Projects.css'

const useStyles = makeStyles(() => ({
    menuIcon: {
        '& svg': {
            fontSize: 30
        },
        'color': '#b3afb0',
        'justify-content': 'flex-end'

    }
})
);


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
    const classes = useStyles()

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
                project.islocal = true
            } else {
                project.islocal = false
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
        fetchProjects(window.settings.get())
            .then(data => {
                const projects = data.map((project: Project) => {
                    project.islocal = localProjects.includes(project.name)
                    return project
                })
                setProjects(projects)
            })
    }, [])

    const projects_list = projects.map((project) =>
        <div className='project-item' key={project.id}>
            <ProjectItem project={project}
                dispatch={dispatch}
                removeProject={removeProject}
                updateProjects={updateProjects} />
        </div>)


    const addProjectBtn = (<IconButton className={classes.menuIcon}
        onClick={() => {
            dispatch({
                type: 'createProject', payload: {
                    addProject: addProject
                }
            })
        }}>
        <Adding />
    </IconButton >
    )
    return (
        <>
            <ProjectsMenu projects_list={projects_list}
                addProjectBtn={addProjectBtn} />

            <div className='workspace'>
                <div className='workspace-background'>
                    {state.page}
                </div>
            </div>
        </>

    )
}


export { Projects, Project }