import { useState, useEffect, useReducer, useContext } from 'react'
import { SettingsContext } from '../../App'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectCreate from './ProjectsCreate'
import ProjectMembers from './members/ProjectMembers'
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
    | { type: 'memberFind', payload: number }
    | { type: 'findProject' }
    | {
        type: 'createProject', payload: {
            setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
        }
    }

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'findProject':
            return { page: <ProjectFind /> }
        case 'createProject':
            return {
                page: <ProjectCreate setProjects={action.payload.setProjects} />
            }
        case 'memberFind':
            return { page: <ProjectMembers project_id={action.payload} /> }

    }
}

const Projects = (): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const [projects, setProjects] = useState<Array<Project>>([{ id: 0, name: "", isclassroom: 0 }])
    const [state, dispatch] = useReducer(reducer, {
        page: <ProjectCreate setProjects={setProjects}/>
    });
    useEffect(() => {
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
            <ProjectsMenu projects={projects} setProjects={setProjects} dispatch={dispatch} />
            <div className='workspace'>
                <div className='workspace-background'>
                    {state.page}
                </div>
            </div>
        </>

    )
}


export { Projects }