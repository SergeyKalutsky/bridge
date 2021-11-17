import { useState } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectFind from './ProjectFind'
import ProjectCreate from './ProjectsCreate'



const Projects = (): JSX.Element => {
    const [iscreate, setIsCreate] = useState(false)
    fetch('http://192.168.1.2:8000/projects/list/sergey', )
        .then(response => response.json())
        .then(data => console.log(data))
    return (
        <>
            <ProjectsMenu setIsCreate={setIsCreate} />
            <div className='workspace'>
                <div className='workspace-background'>
                    {iscreate == true ?
                        <ProjectCreate />: <ProjectFind />
                    }
                </div>
            </div>
        </>
    )
}


export { Projects }