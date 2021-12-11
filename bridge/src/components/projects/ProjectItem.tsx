import { useState } from "react"
import UserIconButton from './icons/UserIconButton'
import TrashIconButton from './icons/TrashIconButton'
import SelectActiveProjectPopUp from './SelectActiveProjectPopUp'
import ActivateProjectPopUp from './ActivateProjectPopUp'
import { Project } from './Projects'

type Props = {
    project: Project
    dispatch: React.Dispatch<any>
    removeProject: (project_id: number) => void
    updateProjects: (project: Project) => void
}


const ProjectItem = ({ project,
    removeProject,
    dispatch,
    updateProjects }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
    const [openActivate, setOpenActivate] = useState(false)
    const [active, setActive] = useState(false)
    
    const buildSpanClassName = () => {
        let baseClass = ''
        baseClass += project.islocal == false ? 'non-active ' : ''
        baseClass += active == true ? 'selected' : ''
        return baseClass
    }
    const setPopUp = (active_project: Project) => {
        window.settings.set({ ...settings, active_project })
        setActive(false)
        setOpen(false)
    }
    const settings = window.settings.get()
    return (
        <div className={'active_project' in settings &&
            settings.active_project.id == project.id ? 'project active' : 'project'}
            onMouseOver={() => { project.islocal == true ? setActive(true) : null }}
            onMouseLeave={() => { project.islocal == true ? setActive(false) : null }}>
            <span className={buildSpanClassName()}
                onClick={(e) => {
                    e.currentTarget.className.includes('non-active') == true ?
                        setOpenActivate(true) :
                        setOpen(true);
                    setActive(false)
                }}
            >
                {project.name}
            </span>
            <SelectActiveProjectPopUp
                project={project}
                setOpen={setOpen}
                open={open}
                setActive={setActive}
                setPopUp={setPopUp} />
            <ActivateProjectPopUp
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