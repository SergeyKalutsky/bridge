import PopUp from '../../common/PopuUp';
import Button from '../../common/Button';
import { deleteProject } from '../../../lib/api/gitlab/index'

type Props = {
    id: number
    name: string
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    removeProject: (project_id: number) => void
}

const DeleteProjectPopUp = ({ name, id, removeProject, open, setOpen }: Props): JSX.Element => {

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
    return (
        <PopUp
            open={open}
            onClose={() => { setOpen(false) }}>
            <div>Вы уверены, что хотите удалить/покинуть проект? (Изменения необратимы)</div>
            <Button onClick={handleClick} btnText='Удалить' />
        </PopUp>
    )
}

export default DeleteProjectPopUp