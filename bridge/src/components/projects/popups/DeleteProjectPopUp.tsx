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
        const active_project = window.settings.get('active_project')
        if (active_project !== undefined && active_project.name === name) {
            console.log('here')
            window.settings.del('active_project')
        }
        const user = window.settings.get('user')
        if (user.login != 'guest') {
            deleteProject(window.settings.get('user'), id)
        }
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