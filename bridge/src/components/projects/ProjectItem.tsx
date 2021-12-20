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


const ProjectItem = ({ project,
    removeProject,
    dispatch,
    updateProjects,
    setActiveProject }: Props): JSX.Element => {
    const [open, setOpenSelectActive] = useState(false)
    const [openActivate, setOpenActivate] = useState(false)
    const [active, setActive] = useState(false)

    const buildSpanClassName = () => {
        let baseClass = ''
        baseClass += project.islocal == false ? 'non-active ' : ''
        baseClass += active == true ? 'selected' : ''
        return baseClass
    }
    const setPopUp = (active_project: Project) => {
        window.settings.set({ active_project: active_project })
        setActive(false)
        setOpenSelectActive(false)
        setActiveProject(active_project.id)
    }
    return (
        <div className={project.isactive == true ? 'project active' : 'project'}
            onMouseOver={() => { project.islocal == true ? setActive(true) : null }}
            onMouseLeave={() => { project.islocal == true ? setActive(false) : null }}>
            <span className={buildSpanClassName()}
                onClick={(e) => {
                    e.currentTarget.className.includes('non-active') == true ?
                        setOpenActivate(true) :
                        setOpenSelectActive(true)
                    setActive(false)
                }}
            >
                {project.name}
            </span>
            <SelectActiveProject
                project={project}
                setOpen={setOpenSelectActive}
                open={open}
                setActive={setActive}
                setPopUp={setPopUp} />
            <ActivateProject
                project={project}
                setOpen={setOpenActivate}
                open={openActivate}
                setActive={setActive}
                updateProjects={updateProjects} />
            {active &&
                <div className='icons'>
                    <UserIconButton id={project.id} dispatch={dispatch} />
                    <TrashIconButton name={project.name}
                        id={project.id}
                        removeProject={removeProject}
                        setActive={setActive} />
                </div>}
        </div>
    )
}

export default ProjectItem