import { useState } from 'react'
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import '../../assets/css/Projects.css'
import ProjectsMenu from './ProjectsMenu'


const Projects = (): JSX.Element => {
    const [name, setName] = useState('test')
    return (
        <>
            <ProjectsMenu setName={setName} />
            <div className='workspace'>
                <div className='workspace-background'>
                </div>
            </div>
        </>
    )
}


export default Projects