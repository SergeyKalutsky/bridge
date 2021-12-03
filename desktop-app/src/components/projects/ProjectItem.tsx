import { useContext, useEffect, useState } from "react"
import UserIconButton from './icons/UserIconButton'
import TrashIconButton from './icons/TrashIconButton'
import { SettingsContext } from '../../App';
import { mapLocalProject } from '../../lib/helpers'
import SelectActiveProjectPopUp from './SelectActiveProjectPopUp'
import ActivateProjectPopUp from './ActivateProjectPopUp'
import { Project } from './Projects'

interface Props {
    project: Project
    dispatch: React.Dispatch<any>
    removeByProjectID: (project_id: number) => void
}


const ProjectItem = ({ project, removeByProjectID, dispatch }: Props): JSX.Element => {
    const [localProject, setProject] = useState(mapLocalProject(project))
    const [open, setOpen] = useState(false)
    const [openActivate, setOpenActivate] = useState(false)
    const { settings, setSettings } = useContext(SettingsContext)
    const [active, setActive] = useState(false)

    const buildSpanClassName = () => {
        let baseClass = ''
        baseClass += localProject.islocal == false ? 'non-active ' : ''
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
            onMouseOver={() => { localProject.islocal == true ? setActive(true) : null }}
            onMouseLeave={() => { localProject.islocal == true ? setActive(false) : null }}>

            <span className={buildSpanClassName()}
                onClick={(e) => {
                    e.target.className.includes('non-active') == true ?
                        setOpenActivate(true) :
                        setOpen(true)
                }}
            >
                {localProject.name}
            </span>
            <SelectActiveProjectPopUp
                project={localProject}
                setOpen={setOpen}
                open={open}
                setPopUp={setPopUp} />
            <ActivateProjectPopUp
                project={localProject}
                setOpen={setOpenActivate}
                open={openActivate} 
                setProject={setProject}/>
            {active &&
                <div className='icons'>
                    <UserIconButton id={localProject.id} dispatch={dispatch} />
                    <TrashIconButton name={localProject.name}
                        id={localProject.id}
                        removeByProjectID={removeByProjectID}
                        setActive={setActive} />
                </div>}
        </div>
    )
}

export default ProjectItem