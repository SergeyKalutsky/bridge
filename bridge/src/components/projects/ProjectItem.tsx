import { useState } from "react"
import UserIconButton from './icons/UserIconButton'
import TrashIconButton from './icons/TrashIconButton'
import SelectActiveProject from './SelectActiveProject'
import ActivateProject from './ActivateProject'
import { Project } from './types'

type Props = {
    project: Project
    dispatch: React.Dispatch<any>
    removeProject: (project_id: number) => void
    updateProjects: (project: Project) => void
    setActiveProject: (project_id: number) => void
}


const ProjectDiv = ({ children, project, handleClick, dispatch, removeProject }) => {
    const [active, setActive] = useState(false)
    const activeProject = project.isactive ? 'border-l-4 border-zinc-50' : ''
    const localProject = project.islocal ? '' : 'after:content-["🔥"] opacity-30'
    console.log(active)
    return (
        <div className={`${activeProject} ${localProject} 
                mt-2 h-18 flex justify-between items-center 
                text-3xl cursor-pointer hover:bg-slate-500`}
            onMouseEnter={() => { project.islocal ? setActive(true) : null }}
            onMouseLeave={() => { project.islocal ? setActive(false) : null }}
            onClick={() => { setActive(false) }}>
            <span className='ml-5 font-medium text-white w-full'
                onClick={() => handleClick(project)}>
                {project.name}
            </span>
            {children}
            {active && project.islocal &&
                <div className='mr-8 w-80px flex flex-row justify-between cursor-pointer text-slate-900 text-2xl'>
                    <UserIconButton id={project.id} dispatch={dispatch} />
                    <TrashIconButton name={project.name}
                        id={project.id}
                        removeProject={removeProject} />
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

    const setPopUp = (active_project: Project) => {
        window.settings.set({ active_project: active_project })
        setOpenSelectActive(false)
        setActiveProject(active_project.id)
    }
    const handleClick = (project) => {
        !project.islocal ? setOpenActivate(true) : setOpenSelectActive(true)
    }
    return (
        <ProjectDiv handleClick={handleClick} project={project} dispatch={dispatch} removeProject={removeProject}>
            <SelectActiveProject
                project={project}
                setOpen={setOpenSelectActive}
                open={open}
                setPopUp={setPopUp} />
            <ActivateProject
                project={project}
                setOpen={setOpenActivate}
                open={openActivate}
                updateProjects={updateProjects} />
        </ProjectDiv>
    )
}

export default ProjectItem