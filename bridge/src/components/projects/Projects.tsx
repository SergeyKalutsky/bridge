import { useState, useEffect, useReducer, createContext } from 'react'
import { ToggleBar, SideMenu, Workspace } from '../common';
import { ProjectsCreate } from './create/ProjectsCreate'
import { ProjectInfo } from './ProjectInfo';
import ProjectItem from './ProjectItem';
import MenuHeader from './MenuHeader';
import { UserProjects, Project } from './types';


type Action =
    | { type: 'memberFind', payload: number }
    | { type: 'createProject' }
    | { type: 'home' }

function reducer(state: { page: JSX.Element }, action: Action) {
    switch (action.type) {
        case 'createProject':
            return { page: <ProjectsCreate /> }
        case 'home':
            return { page: <ProjectInfo /> }
    }
}


interface ProjectContext {
    userProjects: UserProjects,
    deleteProject: (project: Project) => Promise<void>
    addProject: (project: Project) => Promise<void>
    setActiveProject: (project: Project) => void
    dispatch: React.Dispatch<Action>
}

export const projectContext = createContext<ProjectContext>(null)

const Projects = (): JSX.Element => {
    const [userProjects, setUserProjects] = useState<UserProjects>(null)
    const [state, dispatch] = useReducer(reducer, { page: <ProjectInfo /> });
    const [activeToggle, setActiveToggle] = useState(false)
    const handleToggle = () => { setActiveToggle(!activeToggle) }

    useEffect(() => {
        let projects = window.settings.get('userProjects')
        if (!projects) {
            projects ={ activeProject: null, projectList: [] }
        }
        setUserProjects(projects)
    }, [])

    useEffect(() => {
        window.settings.set({ userProjects: userProjects })
    }, [userProjects])

    async function addProject(project: Project): Promise<void> {
        setUserProjects({
            ...userProjects,
            projectList: [...userProjects.projectList, project],
            activeProject: project
        });
    }

    async function deleteProject(project: Project): Promise<void> {
        window.projects.delete(project.name)
        setUserProjects({
            ...userProjects,
            projectList: userProjects.projectList.filter((userProject) => { return userProject.name != project.name; }),
            activeProject: userProjects.activeProject.name == project.name ? null : userProjects.activeProject
        });
    }

    function setActiveProject(project: Project): void {
        setUserProjects({
            ...userProjects,
            activeProject: project
        });
    }

    return (
        <>
            <projectContext.Provider value={{ userProjects, deleteProject, addProject, setActiveProject, dispatch }}>
                <SideMenu activeToggle={activeToggle}>
                    <MenuHeader />
                    {userProjects?.projectList?.map((project, indx) =>
                        <ProjectItem project={project}
                            key={indx}
                        />
                    )}
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