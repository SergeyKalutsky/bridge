import PopUp from '../../common/PopuUp';
import Button from '../../common/Button';
import { UserProjects, Project } from '../types'

type Props = {
    projectDelete: Project
    open: boolean
    userProjects: UserProjects
    setUserProjects: React.Dispatch<React.SetStateAction<UserProjects>>
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteProjectPopUp = ({ projectDelete, userProjects, setUserProjects, open, setOpen }: Props): JSX.Element => {

    const handleClick = () => {
        if (projectDelete.name === userProjects.activeProject.name) {
            window.settings.del('active_project')
        }
        window.projects.delete(projectDelete.name)
        setUserProjects({
            ...userProjects,
            projects: userProjects.projects.filter((project) => { return project.name != projectDelete.name })
        })

        setOpen(false)
    }
    return (
        <PopUp
            open={open}
            onClose={() => { setOpen(false) }}>
            <div>Вы уверены, что хотите удалить проект?</div>
            <Button onClick={handleClick} btnText='Удалить' />
        </PopUp>
    )
}

export default DeleteProjectPopUp