import { useState, useEffect } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectFind from './ProjectFind'
import ProjectCreate from './ProjectsCreate'


type Project = {
    id: number
    name: string
    isclassroom: number
    setIsAddMember?:React.Dispatch<React.SetStateAction<boolean>>
}


const Projects = (): JSX.Element => {
    const [isAddMember, setIsAddMember] = useState(false)
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
                          setIsAddMember={setIsAddMember} />
            <div className='workspace'>
                <div className='workspace-background'>

                    {isAddMember == false ? iscreate == true ?
                        <ProjectCreate /> : <ProjectFind />: null
                    }
                </div>
            </div>
        </>

    )
}


export { Projects }