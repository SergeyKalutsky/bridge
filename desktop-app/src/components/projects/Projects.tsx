import { useState, useEffect } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectFind from './ProjectFind'
import ProjectCreate from './ProjectsCreate'


type Project = {
    id: number;
    name: string
}


const Projects = (): JSX.Element => {
    const [iscreate, setIsCreate] = useState(false)
    const [projects, setProjects] = useState<Array<Project>>([{id:0, name:""}])

    useEffect(() => {
        fetch('http://172.29.0.1:8000/projects/list/sergey')
            .then(response => response.json())
            .then(data => setProjects(data['projects']))
    }, [])
    return (
        <>
            <ProjectsMenu setIsCreate={setIsCreate} projects={projects}/>
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