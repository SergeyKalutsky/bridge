import { useContext, useState } from "react"
import { Project, UserProjects } from './types'
import DeleteProjectPopUp from './popups/DeleteProjectPopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { projectContext } from "./Projects"



const ProjectNameRow = ({ children, project, icons }) => {
    const [active, setActive] = useState(false)
    const { userProjects, setUserProjects } = useContext(projectContext)

    const activeProject = project.name == userProjects.activeProject?.name ? 'border-l-4 border-zinc-50' : ''
    const localProject = project.islocal ? '' : 'after:content-["🔥"] opacity-30'

    const setActiveUserProject = (project: Project) => {
        window.settings.set({ active_project: project })
        setUserProjects({
            ...userProjects,
            activeProject: project
        })
    }
    return (
        <div className={`${activeProject} ${localProject} 
        mt-2 h-18 flex justify-between items-center 
        text-3xl cursor-pointer hover:bg-slate-500`}
            onMouseEnter={() => { project.islocal ? setActive(true) : null }}
            onMouseLeave={() => { project.islocal ? setActive(false) : null }}
            onClick={() => { setActive(false); setActiveUserProject(project) }}>
            {children}
            {active && project.islocal &&
                <div className='mr-8 w-80px flex flex-row justify-between cursor-pointer text-slate-900 text-2xl'>
                    {icons}
                </div>}
        </div>
    )
}


const ProjectItem = ({ project }: { project: Project }): JSX.Element => {
    const [openDelete, setDeleteOpen] = useState(false)
    const icons = (<>
        <div className='hover:text-white'>
            <FontAwesomeIcon icon={faTrashAlt} onClick={() => { setDeleteOpen(true) }} />
        </div>
    </>)
    return (
        <>
            <ProjectNameRow project={project} icons={icons}>
                <span className='ml-5 font-medium text-white w-full'>
                    {project.name}
                </span>
            </ProjectNameRow>

            {/* Popups */}
            <DeleteProjectPopUp
                projectDelete={project}
                open={openDelete}
                setOpen={setDeleteOpen} />
        </>
    )
}

export default ProjectItem