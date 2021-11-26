import { useState, useEffect, useReducer } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
// import ProjectFind from './ProjectFind'
import ProjectCreate from './ProjectsCreate'
import ProjectMembers from './ProjectMembers'
import ProjectFind from './ProjectFind'

type Project = {
    id: number
    name: string
    isclassroom: number
    setMember?: any
}

type State = {
    page: JSX.Element
}

type Action =
    | { type: string }

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'findProject':
            return { page: <ProjectFind /> }
        case 'createProject':
            return { page: <ProjectCreate /> }
        case 'memberFind':
            return { page: <ProjectMembers /> }

    }
}

const dummyProject = [{ id: 0, name: "", isclassroom: 0 }]

const Projects = (): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, { page: <ProjectCreate /> });
    const [projects, setProjects] = useState<Array<Project>>(dummyProject)

    useEffect(() => {
        const settings = JSON.parse(window.sessionStorage.getItem('settings'))
        fetch('http://localhost:8000/projects/list', {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings['user']['X-API-Key'],
            }
        })
            .then(response => response.json())
            .then(data => setProjects(data['projects']))
    }, [])
    return (
        <>
            <ProjectsMenu projects={projects} dispatch={dispatch} />
            <div className='workspace'>
                <div className='workspace-background'>
                    {state.page}
                </div>
            </div>
        </>

    )
}


export { Projects }