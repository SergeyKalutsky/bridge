import PopUp from '../../common/PopuUp'
import Button from '../../common/Button'
import { Project } from '../types'
import { deleteMember } from '../../../lib/api/gitlab/index'

interface Props {
    open: boolean
    project: Project
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    updateProjects: (project: Project) => void
}

const ActivateProjectPopUp = ({ open, setOpen, project, updateProjects }: Props): JSX.Element => {
    const closeModal = () => { setOpen(false)}
    const onDownloadClick = () => {
        window.git.clone(project)
        setOpen(false)
        updateProjects({ ...project, islocal: true })
    }
    const onDeleteClick = () => {
        const settings = window.settings.get()
        deleteMember(settings, project.id, settings.user.id)
        setOpen(false)
    }
    return (
        <PopUp
            open={open}
            onClose={closeModal}
            key={project.name}
        >
            <div className='text-xl font-medium mb-2'>Проект отсутствует локально</div>
            <div className='w-2/5 flex justify-between'>
                <Button onClick={onDownloadClick} btnText='Скачать' />
                <div className='w-5'></div>
                <Button onClick={onDeleteClick} btnText='Удалить' />
            </div>
        </PopUp>
    )
}

export default ActivateProjectPopUp