import { useState, useEffect, useReducer, createContext } from 'react'
import { ToggleBar, SideMenu, Workspace } from '../common';
import { ProjectsCreate } from './create/ProjectsCreate'
import ProjectItem from './ProjectItem';
import MenuHeader from './MenuHeader';
import { UserProjects, Project } from './types';


type Action =
    | { type: 'memberFind', payload: number }
    | { type: 'createProject', payload: Project }
    | { type: 'home' }

function reducer(state: { page: JSX.Element }, action: Action) {
    switch (action.type) {
        case 'createProject':
            return { page: <ProjectsCreate dummyProject={action.payload} /> }
        case 'home':
            return { page: null }
    }
}

const dummyProject: Project = {
    id: null,
    islocal: true,
    name: '',
    description: '',
    http: '',
    thumbnailPath: '',
    template: null
}
interface ProjectContext {
    userProjects: UserProjects,
    setUserProjects: React.Dispatch<React.SetStateAction<UserProjects>>
}

export const projectContext = createContext<ProjectContext>(null)

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
            type: 'createProject',
            payload: dummyProject
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