import Popup from 'reactjs-popup';
import PopUp from '../common/Popup'
import { Project } from './types'
import { deleteMember } from '../../lib/api/index'

interface Props {
    open: boolean
    project: Project
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    updateProjects: (project: Project) => void
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const ActivateProjectPopUp = ({ open, setOpen, project, updateProjects, setActive }: Props): JSX.Element => {
    const closeModal = () => { setOpen(false); setActive(false) }
    return (
        <PopUp
            open={open}
            onClose={closeModal}
            key={project.name}
        >
            <div>Проект отсутствует локально</div>
            <button className="close"
                onClick={() => {
                    window.git.clone(project)
                    setOpen(false)
                    updateProjects({ ...project, islocal: true })
                }}
            >
                Скачать
            </button>
            <button className="close"
                onClick={() => {
                    const settings = window.settings.get()
                    deleteMember(settings, project.id, settings.user.id)
                    setOpen(false)
                }}
            >
                Удалить
            </button>
        </PopUp>
    )
}

export default ActivateProjectPopUp