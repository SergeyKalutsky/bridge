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
        let active_project = window.settings.get('active_project')
        if (active_project !== undefined && active_project.id === id) {
            active_project = undefined;
            window.settings.set(active_project)
        }
        deleteProject(window.settings.get('user'), id)
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