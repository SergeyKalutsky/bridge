import { useState, createContext, useContext } from 'react'
import { Project } from './components/projects/types'


const projectExist = window.settings.get('activeProject')
const initActiveProject = projectExist ? projectExist : []

const ProjectListContext = createContext<{ activeProject: Project[], setActiveProject:  }>(null);

export function ActiveProjectProvider({ children }): JSX.Element {
    const [activeProject, setActiveProject] = useState<Project>(initActiveProject)
    return (
        <ProjectListContext.Provider value={projectsList} >
            {children}
        </ ProjectListContext.Provider>
    )

}


export function useProjectsList(): Project[] {
    return useContext(ProjectListContext);
}

export function useProjectsListDispatch() {
    return useContext(ProjectListDispatchContext);
}