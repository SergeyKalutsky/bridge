import { useEffect, useState } from 'react';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Popup from 'reactjs-popup';


type Project = {
    id: number;
    name: string;
    setActive?: React.Dispatch<React.SetStateAction<boolean>>
    close?: any
}


const TrashIconButton = ({ name, id, setActive }: Project): JSX.Element => {
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
                        console.log(settings['user']['X-API-key'])
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
                        close
                    }}>
                        Удалить
                    </button>
                    <button className="close" onClick={() => { setActive(false); close }}>
                        Закрыть
                    </button>
                </div>
            )
            }
        </Popup >

    )
}


const KeyIconButtonModal = ({ name, setActive,
    close }: Project): JSX.Element => {

    useEffect(() => {
        fetch(`http://localhost:8000/projects/key/${name}`)
            .then(response => response.json())
            .then(data => setKey(data['key']))
    }, [])
    const [key, setKey] = useState('')
    return (<div className="modal">
        <div>{key}</div>
        <button className="close" onClick={() => {
            setActive(false);
            close
        }}>
            Закрыть
        </button>
    </div>)
}

const KeyIconButton = ({ name, id, setActive }: Project): JSX.Element => {
    return (
        <Popup
            trigger={<div className='icon'><FontAwesomeIcon icon={faUserEdit} /></div>}
            position="right center"
        >
            {}
        </Popup >

    )
}

export { KeyIconButton, TrashIconButton }