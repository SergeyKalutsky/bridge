import Popup from 'reactjs-popup';
import { useContext, useState } from "react"
import { UserIconButton, TrashIconButton } from './projectsMenuIcons'
import { SettingsContext } from '../../App';

type Project = {
    id: number;
    name: string;
    isclassroom?: number
}

interface Props {
    project: Project
    dispatch: React.Dispatch<any>
}

const ProjectSelect = ({ project, dispatch }: Props): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const [active, setActive] = useState(false)
    return (
        <div className={'active_project' in settings &&
            settings['active_project']['id'] == project.id ? 'project active' : 'project'}
            onMouseOver={() => { setActive(true) }}
            onMouseLeave={() => { setActive(false) }}>
            <Popup
                trigger={<span className={active == true ? 'selected' : ''}>{project.name}</span>}
                position="right center"
                key={project.name}
                modal>
                {close => (
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
                            close()
                        }}>
                            ОК
                        </button>
                    </div>
                )
                }
            </Popup>
            {active &&
                <div className='icons'>
                    <UserIconButton id={project.id} dispatch={dispatch} />
                    <TrashIconButton name={project.name} id={project.id} />
                </div>}
        </div>
    )
}

export default ProjectSelect