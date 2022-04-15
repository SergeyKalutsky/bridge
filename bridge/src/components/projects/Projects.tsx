import { useState, useEffect, useReducer } from 'react'
import { ToggleBar, SideMenu, Workspace } from '../common';
import ProjectCreate from './ProjectsCreate'
import ProjectItem from './ProjectItem';
import ProjectMembers from './members/ProjectMembers'
import MenuHeader from './MenuHeader';
import { createProject } from '../../lib/api/gitlab'
import { UserProjects, Project } from './types';


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
            return { page: <ProjectCreate addProject={action.payload.addProject} /> }
        case 'memberFind':
            return { page: <ProjectMembers project_id={action.payload} /> }
        case 'home':
            return { page: null }
    }
}


const Projects = (): JSX.Element => {
    const [userProjects, setUserProjects] = useState<UserProjects>(null)
    const [state, dispatch] = useReducer(reducer, { page: null });
    const [activeToggle, setActiveToggle] = useState(false)
    const handleToggle = () => { setActiveToggle(!activeToggle) }

    const addProject = (project: Project) => {

        const user = window.settings.get('user')
        if (user.type == 'guest') {
            window.git.clone(project)
        } else {
            createProject(user, project)
                .then(data => window.git.clone(data['project']))
        }
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


    useEffect(() => {
        const user = window.settings.get('user')
        if (user.type == 'guest') {
            const projects = []
            const localProjectNames = window.projects.getLocalProjectsNames()
            for (const localProjectName of localProjectNames) {
                projects.push({
                    name: localProjectName,
                    islocal: true
                })
            }
            setUserProjects({
                projects: projects,
                activeProject: window.settings.get('active_project')
            })
        }
        // gitlab related stuff -->  2 release
        // fetchProjects(user)
        //     .then(data => {
        //         const projects = data.map((project: Project) => {
        //             project.islocal = localProjects.includes(project.name)
        //             project.isactive = active_project !== undefined && active_project.id == project.id
        //             return project
        //         })
        //         setProjects(projects)
        //     })
    }, [])

    const dispatchCreateProject = () => {
        dispatch({
            type: 'createProject',
            payload: { addProject: addProject }
        })
    }

    const projects_list = userProjects.projects.map((project, indx) =>
        <ProjectItem project={project}
            key={indx}
            userProjects={userProjects}
            setUserProjects={setUserProjects} />
    )
    return (
        <>
            <SideMenu activeToggle={activeToggle}>
                <MenuHeader onClick={dispatchCreateProject} />
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