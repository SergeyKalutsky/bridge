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


function reducer(state, action) {
    switch (action.type) {
        case 'findProject':
            return { page: <ProjectFind /> }
        case 'createProject':
            return { page: <ProjectCreate /> }
        case 'memberFind':
            return <ProjectMembers />

    }
}


const Projects = (): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, { page: <ProjectCreate /> });
    const [projects, setProjects] = useState<Array<Project>>([{ id: 0, name: "", isclassroom: 0 }])

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