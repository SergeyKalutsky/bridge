import { useState } from 'react'
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'
import ProjectFind from './ProjectFind'
import ProjectCreate from './ProjectsCreate'


const Projects = (): JSX.Element => {
    const [iscreate, setIsCreate] = useState(false)
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


export { Projects, Page }