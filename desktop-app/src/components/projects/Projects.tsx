import { useState, useEffect } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectFind from './ProjectFind'
import ProjectCreate from './ProjectsCreate'


type Project = {
    id: number
    name: string
    isclassroom: number
}


const Projects = (): JSX.Element => {
    const [iscreate, setIsCreate] = useState(false)
    const [projects, setProjects] = useState<Array<Project>>([{ id: 0, name: "", isclassroom: 0 }])

    useEffect(() => {
        const settings = JSON.parse(window.sessionStorage.getItem('settings'))
        fetch('http://localhost:8000/projects/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': settings['user']['api_key'],
                'user-id': settings['user']['id'],
            }
        })
            .then(response => response.json())
            .then(data => setProjects(data['projects']))
    }, [])
    return (
        <>
            <ProjectsMenu setIsCreate={setIsCreate} projects={projects} />
            <div className='workspace'>
                <div className='workspace-background'>
                    {iscreate == true ?
                        <ProjectCreate /> : <ProjectFind />
                    }
                </div>
            </div>
        </>

    )
}


export { Projects }