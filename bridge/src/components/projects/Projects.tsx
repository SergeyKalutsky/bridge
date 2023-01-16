import { useState, useEffect, useReducer, createContext } from 'react'
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
    | { type: 'createProject' }
    | { type: 'home' }

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'createProject':
            return { page: <ProjectCreate /> }
        case 'home':
            return { page: null }
    }
}


export const projectContext = createContext(null)

const Projects = (): JSX.Element => {
    const [userProjects, setUserProjects] = useState<UserProjects>(null)
    const [state, dispatch] = useReducer(reducer, { page: null });
    const [activeToggle, setActiveToggle] = useState(false)
    const handleToggle = () => { setActiveToggle(!activeToggle) }

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
            type: 'createProject'
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
                ) : null}
            </SideMenu>
            <ToggleBar handleToggle={handleToggle} />
            <Workspace>
                <projectContext.Provider value={{ userProjects, setUserProjects }}>
                    {state.page}
                </projectContext.Provider>
            </Workspace>
        </>

    )
}


export default Projects 