import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Popup from 'reactjs-popup';
import { ipcRenderer } from 'electron';
import { useContext, useState } from 'react';
import { SettingsContext } from '../../../App';


type Project = {
    id: number
    name: string
    isclassroom: number
}

type Props = {
    id: number
    name: string
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    removeByProjectID: (project_id: number) => void
}

const TrashIconButton = ({ name, id, removeByProjectID, setActive }: Props): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const [open, setOpen] = useState(false)
    return (
        <>
            <div className='icon' onClick={() => {
                setOpen(true)
            }}>
                <FontAwesomeIcon icon={faTrashAlt} /></div>
            <Popup
                open={open}
                position="right center"
                modal
                closeOnDocumentClick
                onClose={() => {
                    setOpen(false)
                    setActive(false)
                }}
            >
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
                        removeByProjectID(id)
                        setSettings({ user: settings.user })
                    }}>
                        Удалить
                    </button>
                    <button className="close" onClick={() => { setOpen(false) }}>
                        Закрыть
                    </button>
                </div>
            </Popup >
        </>

    )
}

export default TrashIconButton