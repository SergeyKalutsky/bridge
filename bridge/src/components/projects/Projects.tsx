import { useState, useEffect, useReducer, createContext } from 'react'
import { ToggleBar, SideMenu, Workspace } from '../common';
import { ProjectsCreate } from './create/ProjectsCreate'
import { ProjectInfo } from './ProjectInfo';
import ProjectItem from './ProjectItem';
import MenuHeader from './MenuHeader';
import { UserProjects, Project } from './types';


type Action =
    | { type: 'projectInfo' }
    | { type: 'createProject' }
    | { type: 'home' }

function reducer(state: { page: JSX.Element }, action: Action) {
    switch (action.type) {
        case 'createProject':
            return { page: <ProjectsCreate /> }
        case 'projectInfo':
            return { page: <ProjectInfo /> }
        case 'home':
            return { page: null }
    }
}


interface ProjectContext {
    userProjects: UserProjects,
    deleteProject: (project: Project) => Promise<void>
    addProject: (project: Project) => Promise<void>
    setActiveProject: (project: Project) => void
    updateProject: ({ projectName, newProject }: { projectName: string, newProject: Project }) => void
    dispatch: React.Dispatch<Action>
}

export const projectContext = createContext<ProjectContext>(null)

const Projects = (): JSX.Element => {
    const [userProjects, setUserProjects] = useState<UserProjects>(null)
    const [state, dispatch] = useReducer(reducer, { page: null });
    const [activeToggle, setActiveToggle] = useState(false)
    const handleToggle = () => { setActiveToggle(!activeToggle) }

    useEffect(() => {
        let projects = window.settings.get('userProjects')
        if (!projects) {
            projects = { activeProject: null, projectList: [] }
        }
        setUserProjects(projects)
        if (projects.activeProject) {
            // If we have a selected active project on 
            // the load we are going to show the info about it
            dispatch({ type: 'projectInfo' })
        }
    }, [])

    useEffect(() => {
        window.settings.set({ userProjects: userProjects })
    }, [userProjects])

    async function addProject(project: Project): Promise<void> {
        setUserProjects({
            ...userProjects,
            projectList: [...userProjects.projectList, project],
            activeProject: null
        });
    }

    async function updateProject({ projectName, newProject }: { projectName: string, newProject: Project }): Promise<void> {
        newProject.activePath = projectName !== newProject.name ?
            await window.projects.rename({ newName: newProject.name, activePath: newProject.activePath })
            : newProject.activePath
            
        console.log(newProject)
        const newProjects = userProjects.projectList.filter((userProject) => { return userProject.name != projectName; })
        newProjects.push(newProject)
        setUserProjects({
            ...userProjects,
            projectList: newProjects,
            activeProject: newProject
        });
        dispatch({ type: 'projectInfo' })
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
        dispatch({ type: 'projectInfo' })
    }

    return (
        <>
            <projectContext.Provider value={{ userProjects, deleteProject, addProject, setActiveProject, updateProject, dispatch }}>
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