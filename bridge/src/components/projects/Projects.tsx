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
    deleteProject: (project: Project) => Promise<void>
    addProject: (project: Project) => Promise<void>
    setActiveProject: (project: Project) => void
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

    async function addProject(project: Project): Promise<void> {

        project.islocal = true;
        if (userProjects.activeProject === undefined) {
            window.settings.set({ active_project: project });
        }
        setUserProjects({
            ...userProjects,
            projects: [...userProjects.projects, project],
            activeProject: userProjects.activeProject === undefined ? project : userProjects.activeProject
        });
    }

    async function deleteProject(project: Project): Promise<void> {
        if (project.name === userProjects.activeProject.name) {
            window.settings.del('active_project');
        }
        window.projects.delete(project.name);
        setUserProjects({
            ...userProjects,
            projects: userProjects.projects.filter((userProject) => { return userProject.name != project.name; })
        });
    }

    function setActiveProject(project: Project): void {
        window.settings.set({ active_project: project });
        setUserProjects({
            ...userProjects,
            activeProject: project
        });
    }

    const dispatchCreateProject = () => {
        dispatch({
            type: 'createProject',
            payload: dummyProject
        })
    }

    return (
        <>
            <projectContext.Provider value={{ userProjects, deleteProject, addProject, setActiveProject }}>
                <SideMenu activeToggle={activeToggle}>
                    <MenuHeader onClick={dispatchCreateProject} />
                    {userProjects !== null ? userProjects.projects.map((project, indx) =>
                        <ProjectItem project={project}
                            key={indx}
                        />
                    ) : null}
                </SideMenu>
                <ToggleBar handleToggle={handleToggle} />
                <Workspace>
                    {state.page}
                </Workspace>
            </projectContext.Provider>
        </>

    )
}


export default Projects 