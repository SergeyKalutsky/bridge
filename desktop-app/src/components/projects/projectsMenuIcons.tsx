import { useEffect, useState } from 'react';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Popup from 'reactjs-popup';
import { ipcRenderer } from 'electron';


type TrashProps = {
    id: number
    name: string
}

type UserProps = {
    id: number
    name: string
    dispatch: React.Dispatch<any>
}


const TrashIconButton = ({ name, id }: TrashProps): JSX.Element => {
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
                        const settings = JSON.parse(window.sessionStorage.getItem('settings'))
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


const UserIconButton = ({ name, id, dispatch }: UserProps): JSX.Element => {
    return (
        <div className='icon'><FontAwesomeIcon icon={faUserEdit}
            onClick={() => { dispatch({ type: 'memberFind' }) }}
        /></div>
    )
}

export { UserIconButton, TrashIconButton }