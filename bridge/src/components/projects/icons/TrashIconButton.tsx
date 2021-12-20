import Popup from 'reactjs-popup';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { deleteProject } from '../../../lib/api/index'

type Props = {
    id: number
    name: string
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    removeProject: (project_id: number) => void
}

const TrashIconButton = ({ name, id, removeProject, setActive }: Props): JSX.Element => {
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
                        const settings = window.settings.get()
                        if (settings.active_project !== undefined && settings.active_project.id === id){
                            settings.active_project = undefined;
                            console.log(settings)
                            window.settings.set(settings)
                        }
                        deleteProject(settings, id)
                        window.projects.delete(name)
                        removeProject(id)
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