import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Popup from 'reactjs-popup';
import { ipcRenderer } from 'electron';
import { useContext } from 'react';
import { SettingsContext } from '../../../App';


type Project = {
    id: number
    name: string
    isclassroom: number
}

type Props = {
    id: number
    name: string
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
}

const TrashIconButton = ({ name, id, setProjects }: Props): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    return (
        <Popup
            trigger={<div className='icon'><FontAwesomeIcon icon={faTrashAlt} /></div>}
            position="right center"
            modal
        >
            {() => (
                <div className="modal">
                    <div>Вы уверены, что хотите удалить/покинуть проект? (Изменения необратимы)</div>
                    <button className="close" onClick={() => {
                        fetch('http://localhost:8000/projects/delete',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': settings['user']['X-API-Key'],
                                },
                                body: JSON.stringify({ id: id, name: name })
                            })
                            .then(response => response.json())
                        ipcRenderer.send('projects', { cmd: 'delete', project: { name: name, id: id } })
                        setSettings({ user: settings.user })
                        fetch('http://localhost:8000/projects/list', {
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': settings['user']['X-API-Key'],
                            }
                        })
                            .then(response => response.json())
                            .then(data => setProjects(data['projects']))
                    }}>
                        Удалить
                    </button>
                    <button className="close" onClick={() => { close }}>
                        Закрыть
                    </button>
                </div>
            )
            }
        </Popup >

    )
}

export default TrashIconButton