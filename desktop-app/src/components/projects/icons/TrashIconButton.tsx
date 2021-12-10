import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Popup from 'reactjs-popup';
const { ipcRenderer } = window.require('electron');
import { useContext, useState } from 'react';
import { SettingsContext } from '../../../App';
import { deleteProject } from '../../../lib/api/index'

type Props = {
    id: number
    name: string
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    removeProject: (project_id: number) => void
}

const TrashIconButton = ({ name, id, removeProject, setActive }: Props): JSX.Element => {
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
                    <button className="close danger" onClick={() => {
                        deleteProject(settings, id)
                        ipcRenderer.send('projects', { cmd: 'delete', project: { name: name, id: id } })
                        removeProject(id)
                        setSettings({ user: settings.user })
                        setOpen(false)
                    }}>
                        Удалить
                    </button>
                </div>
            </Popup >
        </>

    )
}

export default TrashIconButton