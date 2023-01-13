import { useState, useEffect, useReducer } from 'react'
import { ToggleBar, SideMenu, Workspace } from '../common';
import ProjectCreate from './ProjectsCreate'
import ProjectItem from './ProjectItem';
import MenuHeader from './MenuHeader';
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
        case 'home':
            return { page: null }
    }
}


const Projects = (): JSX.Element => {
    const [userProjects, setUserProjects] = useState<UserProjects>(null)
    const [state, dispatch] = useReducer(reducer, { page: null });
    const [activeToggle, setActiveToggle] = useState(false)
    const handleToggle = () => { setActiveToggle(!activeToggle) }

    const addProject = async (project: Project) => {

        const user = window.settings.get('user')
        if (user.type == 'guest') {
            await window.git.clone(project)
        }
        project.islocal = true
        if (userProjects.activeProject === undefined) {
            window.settings.set({active_project: project})
        }
        setUserProjects({
            ...userProjects,
            projects: [...userProjects.projects, project],
            activeProject: userProjects.activeProject === undefined ? project : userProjects.activeProject
        })
        dispatch({ type: 'home' })

    }

    useEffect(() => {
        const user = window.settings.get('user')
        if (user.type == 'guest') {
            const projects = []
            const localProjectNames = window.projects.getLocalProjectsNames()
            for (const localProjectName of localProjectNames) {
                if (localProjectName !== '.DS_Store') {
                    projects.push({
                        name: localProjectName,
                        islocal: true
                    })
                }
            }
            setUserProjects({
                projects: projects,
                activeProject: window.settings.get('active_project')
            })
        }
    }, [])

    const dispatchCreateProject = () => {
        dispatch({
            type: 'createProject',
            payload: { addProject: addProject }
        })
    }

    return (
        <>
            <SideMenu activeToggle={activeToggle}>
                <MenuHeader onClick={dispatchCreateProject} />
                {userProjects !== null ? userProjects.projects.map((project, indx) =>
                    <ProjectItem project={project}
                        key={indx}
                        userProjects={userProjects}
                        setUserProjects={setUserProjects} />
                ): null}
            </SideMenu>
            <ToggleBar handleToggle={handleToggle} />
            <Workspace>
                {state.page}
            </Workspace>
        </>

    )
}


export default Projects 