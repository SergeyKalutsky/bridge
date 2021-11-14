import { useState } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'


const Projects = (): JSX.Element => {
    const [name, setName] = useState('test')
    return (
        <>
        <ProjectsMenu name={name} setName={setName}/>
        <div className='workspace'>
            <div className='workspace-background'>
                {name}
            </div>
        </div>
        </>
    )
}


export default Projects