import Popup from 'reactjs-popup';
import { useContext, useState } from "react"
import UserIconButton from './icons/UserIconButton'
import TrashIconButton from './icons/TrashIconButton'
import { SettingsContext } from '../../App';

type Project = {
    id: number;
    name: string;
    isclassroom?: number
}

interface Props {
    project: Project
    dispatch: React.Dispatch<any>
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

const ProjectSelect = ({ project, setProjects, dispatch }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
    const { settings, setSettings } = useContext(SettingsContext)
    const [active, setActive] = useState(false)
    return (
        <div className={'active_project' in settings &&
            settings.active_project.id == project.id ? 'project active' : 'project'}
            onMouseOver={() => { setActive(true) }}
            onMouseLeave={() => { setActive(false) }}>
            <span className={active == true ? 'selected' : ''}
            onClick={() => setOpen(true)}
            >{project.name}</span>
            <Popup
                open={open}
                onClose={() => setOpen(false)}
                closeOnDocumentClick
                position="right center"
                key={project.name}
                modal>
                <div className="modal">
                    <div>Проект выбран как основной</div>
                    <button className="close" onClick={() => {
                        const active_project = {
                            name: project.name,
                            id: project.id,
                            isclassroom: project.isclassroom,
                            isuserowner: 1
                        }
                        setSettings({ ...settings, active_project })
                        setActive(false)
                        setOpen(false)
                    }}>
                        ОК
                    </button>
                </div>
            </Popup>
            {active &&
                <div className='icons'>
                    <UserIconButton id={project.id} dispatch={dispatch} />
                    <TrashIconButton name={project.name} id={project.id} setProjects={setProjects} setActive={setActive}/>
                </div>}
        </div>
    )
}

export default ProjectSelect