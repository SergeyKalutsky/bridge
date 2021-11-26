import Popup from 'reactjs-popup';
import { useState } from "react"
import { ipcRenderer } from "electron"
import { UserIconButton, TrashIconButton } from './projectsMenuIcons'

interface Props {
    name: string
    id: number
    isclassroom: number
    setMember: React.Dispatch<React.SetStateAction<{
        on: boolean;
        project_name: string;
    }>>
}

const ProjectSelect = ({ name,
    id,
    isclassroom,
    setMember }: Props): JSX.Element => {
    const [active, setActive] = useState(false)
    const settings = JSON.parse(window.sessionStorage.getItem('settings'))
    return (
        <div className={'active_project' in settings &&
            settings['active_project']['id'] == id ? 'project active' : 'project'}
            onMouseOver={() => { setActive(true) }}
            onMouseLeave={() => { setActive(false) }}>
            <Popup
                trigger={<span className={active == true ? 'selected' : ''}>{name}</span>}
                position="right center"
                key={name}
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
                                            'name': name,
                                            'id': id,
                                            'isclassroom': isclassroom
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
                    <UserIconButton name={name} id={id} setActive={setActive} setMember={setMember} />
                    <TrashIconButton name={name} id={id} setActive={setActive} />
                </div>}
        </div>
    )
}

export default ProjectSelect