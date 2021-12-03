import { useContext, useState } from "react"
import UserIconButton from './icons/UserIconButton'
import TrashIconButton from './icons/TrashIconButton'
import { SettingsContext } from '../../App';
import { mapLocalProject } from '../../lib/helpers'
import SelectActiveProjectPopUp from './SelectActiveProjectPopUp'
import ActiveteProjectPopUp from './ActivateProjectPopUp'
import { Project } from './Projects'

interface Props {
    project: Project
    dispatch: React.Dispatch<any>
    removeByProjectID: (project_id: number) => void
}


const ProjectItem = ({ project, removeByProjectID, dispatch }: Props): JSX.Element => {

    const [open, setOpen] = useState(false)
    const [openActivate, setOpenActivate] = useState(false)
    const { settings, setSettings } = useContext(SettingsContext)
    const [active, setActive] = useState(false)

    project = mapLocalProject(project)
    const buildSpanClassName = (project: Project) => {
        let baseClass = ''
        baseClass += project.islocal == false ? 'non-active ' : ''
        baseClass += active == true ? 'selected' : ''
        return baseClass
    }
    const setPopUp = (active_project: Project) => {
        setSettings({ ...settings, active_project })
        setActive(false)
        setOpen(false)
    }
    return (
        <div className={'active_project' in settings &&
            settings.active_project.id == project.id ? 'project active' : 'project'}
            onMouseOver={() => { setActive(true) }}
            onMouseLeave={() => { setActive(false) }}>

            <span className={buildSpanClassName(project)}
                onClick={(e) => {
                    e.target.className.includes('non-active') == true ?
                        setOpenActivate(true) :
                        setOpen(true)
                }}
            >
                {project.name}
            </span>
            <SelectActiveProjectPopUp
                project={project}
                setOpen={setOpen}
                open={open}
                setPopUp={setPopUp} />
            <ActiveteProjectPopUp
                project={project}
                setOpen={setOpenActivate}
                open={openActivate} />
            {active &&
                <div className='icons'>
                    <UserIconButton id={project.id} dispatch={dispatch} />
                    <TrashIconButton name={project.name}
                        id={project.id}
                        removeByProjectID={removeByProjectID}
                        setActive={setActive} />
                </div>}
        </div>
    )
}

export default ProjectItem