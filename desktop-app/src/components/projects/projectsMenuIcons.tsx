import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Popup from 'reactjs-popup';
import { ipcRenderer } from 'electron';
import { useContext } from 'react';
import { SettingsContext } from '../../App';


type TrashProps = {
    id: number
    name: string
}

type UserProps = {
    id: number
    dispatch: React.Dispatch<any>
}


const TrashIconButton = ({ name, id }: TrashProps): JSX.Element => {
    const {settings, setSettings} = useContext(SettingsContext)
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
                            .then(data => data['stutus'] == 'sucesses' ?
                                window.location.reload() : console.log(data));
                        ipcRenderer.send('projects', { cmd: 'delete', project: { name: name, id: id } })
                        name == settings.active_project.name ? delete settings.active_project : null
                        setSettings(settings)
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


const UserIconButton = ({ id, dispatch }: UserProps): JSX.Element => {
    
    return (
        <div className='icon'><FontAwesomeIcon icon={faUserEdit}
            onClick={() => { dispatch({ type: 'memberFind', payload: id}) }}
            /></div>
    )
}

export { UserIconButton, TrashIconButton }