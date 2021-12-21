import PopUp from '../../common/PopUp';
import Button from '../../common/Button';
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
    const handleClick = () => {
        const settings = window.settings.get()
        if (settings.active_project !== undefined && settings.active_project.id === id) {
            settings.active_project = undefined;
            console.log(settings)
            window.settings.set(settings)
        }
        deleteProject(settings, id)
        window.projects.delete(name)
        removeProject(id)
        setOpen(false)
    }
    const handleClose = () => {
        setOpen(false)
        setActive(false)
    }
    return (
        <>
            <div className='icon' onClick={() => { setOpen(true) }}>
                <FontAwesomeIcon icon={faTrashAlt} />
            </div>
            <PopUp
                open={open}
                onClose={handleClose}>
                <div>Вы уверены, что хотите удалить/покинуть проект? (Изменения необратимы)</div>
                <Button onClick={handleClick} btnText='Удалить' />
            </PopUp>
        </>

    )
}

export default TrashIconButton