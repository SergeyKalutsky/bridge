import { useContext, useState } from "react"
import { Project } from './types'
import { projectContext } from "./Projects"



const ProjectNameRow = ({ children, project }) => {
    const [active, setActive] = useState(false)
    const { userProjects, setActiveProject } = useContext(projectContext)

    const activeProject = project.name == userProjects.activeProject?.name ? 'border-l-4 border-zinc-50' : ''
    const localProject = project.islocal ? '' : 'after:content-["🔥"] opacity-30'

    return (
        <div className={`${activeProject} ${localProject} 
        mt-2 h-18 flex justify-between items-center 
        text-3xl cursor-pointer hover:bg-slate-500`}
            onMouseEnter={() => { project.islocal ? setActive(true) : null }}
            onMouseLeave={() => { project.islocal ? setActive(false) : null }}
            onClick={() => { setActive(false); setActiveProject(project) }}>
            {children}
        </div>
    )
}


const ProjectItem = ({ project }: { project: Project }): JSX.Element => {
    return (
        <>
            <ProjectNameRow project={project}>
                <span className='ml-5 font-medium text-white w-full'>
                    {project.name}
                </span>
            </ProjectNameRow>
        </>
    )
}

export default ProjectItem