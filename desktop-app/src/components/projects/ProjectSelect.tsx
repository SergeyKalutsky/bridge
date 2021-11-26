import Popup from 'reactjs-popup';
import { useState } from "react"
import { ipcRenderer } from "electron"
import { UserIconButton, TrashIconButton } from './projectsMenuIcons'

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
    const [active, setActive] = useState(false)
    const settings = JSON.parse(window.sessionStorage.getItem('settings'))
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
                {
                    <div className="modal">
                        <div>Проект выбран как основной</div>
                        <button className="close" onClick={() => {
                            ipcRenderer.send('user-settings',
                                {
                                    cmd: 'set',
                                    data: {
                                        'active_project': {
                                            'name': project.name,
                                            'id': project.id,
                                            'isclassroom': project.isclassroom
                                        }
                                    }
                                });
                            window.location.reload()
                        }}>
                            ОК
                        </button>
                    </div>
                }
            </Popup>
            {active &&
                <div className='icons'>
                    <UserIconButton name={project.name} id={project.id} dispatch={dispatch} />
                    <TrashIconButton name={project.name} id={project.id} />
                </div>}
        </div>
    )
}

export default ProjectSelect