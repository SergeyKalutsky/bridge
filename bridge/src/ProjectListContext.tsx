import { createContext, useReducer, useContext } from 'react'
import { Project } from './components/projects/types'


type Action =
    | { type: 'set', payload: Project[] }
    | { type: 'add', payload: Project }
    | { type: 'update', payload: Project }
    | { type: 'delete', payload: Number }


function projectListReducer(state: Project[], action: Action) {
    switch (action.type) {
        case 'set':
            return action.payload
        case 'add':
            return { ...state, ...action.payload }
        case 'update': {
            const newProjects = state.filter((userProject) => { return userProject.id != action.payload.id; })
            newProjects.push(action.payload)
            return newProjects
        }
        case 'delete':
            return state.filter((userProject) => { return userProject.id != action.payload; })
    }
}

const existProjects = window.settings.get('projectsList')
const initProjectsList = existProjects ? existProjects : []

const ProjectListDispatchContext = createContext<React.Dispatch<Action>>(null);
const ProjectListContext = createContext<Project[]>(null);


export function ProjectsListProvider({ children }): JSX.Element {
    const [projectsList, dispatch] = useReducer(projectListReducer, initProjectsList)
    return (
        <ProjectListContext.Provider value={projectsList} >
            <ProjectListDispatchContext.Provider value={dispatch}>
                {children}
            </ ProjectListDispatchContext.Provider>
        </ ProjectListContext.Provider>
    )

}

export function useProjectsList(): Project[] {
    return useContext(ProjectListContext);
}

export function useProjectsListDispatch() {
    return useContext(ProjectListDispatchContext);
}
