import { useState, useEffect } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectFind from './ProjectFind'
import ProjectCreate from './ProjectsCreate'
import ProjectMembers from './ProjectMembers'

type Project = {
    id: number
    name: string
    isclassroom: number
    setMember?: any
}

type Member = {
    on: boolean;
    project_id?: number
}


const Projects = (): JSX.Element => {
    const [member, setMember] = useState({on: false, project_id:0})
    const [iscreate, setIsCreate] = useState(false)
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
            <ProjectsMenu setIsCreate={setIsCreate}
                projects={projects}
                setMember={setMember} />
            <div className='workspace'>
                <div className='workspace-background'>

                    {member.on == false ? iscreate == true ?
                        <ProjectCreate /> : <ProjectFind /> : <ProjectMembers project_id={member.project_id} />
                    }
                </div>
            </div>
        </>

    )
}


export { Projects }