import { useState } from "react"
import { Project, UserProjects } from './types'
import DeleteProjectPopUp from './popups/DeleteProjectPopUp'
import SelectActiveProjectPopUp from './popups/SelectActiveProjectPopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'



const ProjectNameRow = ({ children, project, userProjects, icons }) => {
    const [active, setActive] = useState(false)
    const activeProject = project.name == userProjects.activeProject?.name ? 'border-l-4 border-zinc-50' : ''
    const localProject = project.islocal ? '' : 'after:content-["🔥"] opacity-30'
    return (
        <div className={`${activeProject} ${localProject} 
        mt-2 h-18 flex justify-between items-center 
        text-3xl cursor-pointer hover:bg-slate-500`}
            onMouseEnter={() => { project.islocal ? setActive(true) : null }}
            onMouseLeave={() => { project.islocal ? setActive(false) : null }}
            onClick={() => { setActive(false) }}>
            {children}
            {active && project.islocal &&
                <div className='mr-8 w-80px flex flex-row justify-between cursor-pointer text-slate-900 text-2xl'>
                    {icons}
                </div>}
        </div>
    )
}



type Props = {
    project: Project
    userProjects: UserProjects
    setUserProjects: React.Dispatch<React.SetStateAction<UserProjects>>
}

const ProjectItem = ({ project,
    userProjects,
    setUserProjects }: Props): JSX.Element => {
    const [open, setOpenSelectActive] = useState(false)
    const [openDelete, setDeleteOpen] = useState(false)

    const setPopUp = (activeProject: Project) => {
        window.settings.set({ active_project: activeProject })
        setOpenSelectActive(false)
        setUserProjects({
            ...userProjects,
            activeProject: activeProject
        })
    }
    const icons = (<>
        <div className='hover:text-white'>
            <FontAwesomeIcon icon={faTrashAlt} onClick={() => { setDeleteOpen(true) }} />
        </div>
    </>)
    return (
        <>
            <ProjectNameRow project={project} userProjects={userProjects} icons={icons}>
                <span className='ml-5 font-medium text-white w-full'
                    onClick={() => { setOpenSelectActive(true) }}>
                    {project.name}
                </span>
            </ProjectNameRow>

            {/* Popups */}
            <SelectActiveProjectPopUp
                project={project}
                setOpen={setOpenSelectActive}
                open={open}
                setPopUp={setPopUp} />
            <DeleteProjectPopUp
                projectDelete={project}
                userProjects={userProjects}
                setUserProjects={setUserProjects}
                open={openDelete}
                setOpen={setDeleteOpen} />
        </>
    )
}

export default ProjectItem