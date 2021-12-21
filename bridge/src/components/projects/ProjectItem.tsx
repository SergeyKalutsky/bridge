import { useState } from "react"
import { Project } from './types'
import ActivateProjectPopUp from './popups/ActivateProjectPopUp'
import DeleteProjectPopUp from './popups/DeleteProjectPopUp'
import SelectActiveProjectPopUp from './popups/SelectActiveProjectPopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

type Props = {
    project: Project
    dispatch: React.Dispatch<any>
    removeProject: (project_id: number) => void
    updateProjects: (project: Project) => void
    setActiveProject: (project_id: number) => void
}


const ProjectDiv = ({ children, project, icons }) => {
    const [active, setActive] = useState(false)
    const activeProject = project.isactive ? 'border-l-4 border-zinc-50' : ''
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


const ProjectItem = ({ project,
    removeProject,
    dispatch,
    updateProjects,
    setActiveProject }: Props): JSX.Element => {
    const [open, setOpenSelectActive] = useState(false)
    const [openActivate, setOpenActivate] = useState(false)
    const [openDelete, setDeleteOpen] = useState(false)
    const setPopUp = (active_project: Project) => {
        window.settings.set({ active_project: active_project })
        setOpenSelectActive(false)
        setActiveProject(active_project.id)
    }
    const icons = (<>
        <div className='hover:text-white'>
            <FontAwesomeIcon icon={faUserEdit}
                onClick={() => { dispatch({ type: 'memberFind', payload: project.id }) }}
            />
        </div>
        <div className='hover:text-white'>
            <FontAwesomeIcon icon={faTrashAlt} onClick={() => { setDeleteOpen(true) }} />
        </div>
    </>)
    return (
        <>
            <ProjectDiv project={project} icons={icons}>
                <span className='ml-5 font-medium text-white w-full'
                    onClick={() => { !project.islocal ? setOpenActivate(true) : setOpenSelectActive(true) }}>
                    {project.name}
                </span>
            </ProjectDiv>
            {/* Popups */}
            <SelectActiveProjectPopUp
                project={project}
                setOpen={setOpenSelectActive}
                open={open}
                setPopUp={setPopUp} />
            <ActivateProjectPopUp
                project={project}
                setOpen={setOpenActivate}
                open={openActivate}
                updateProjects={updateProjects} />
            <DeleteProjectPopUp
                name={project.name}
                id={project.id}
                removeProject={removeProject}
                open={openDelete}
                setOpen={setDeleteOpen} />
        </>
    )
}

export default ProjectItem