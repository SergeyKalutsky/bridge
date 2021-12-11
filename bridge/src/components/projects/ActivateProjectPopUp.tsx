import Popup from 'reactjs-popup';
import { Project } from './Projects'
import { deleteMember } from '../../lib/api/index'

interface Props {
    open: boolean
    project: Project
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    updateProjects: (project: Project) => void
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const ActivateProjectPopUp = ({ open, setOpen, project, updateProjects, setActive }: Props): JSX.Element => {
    return (
        <Popup
            open={open}
            onClose={() => { setOpen(false); setActive(false) }}
            closeOnDocumentClick
            position="right center"
            key={project.name}
            modal>
            <div className="modal">
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
            </div>
        </Popup>
    )
}

export default ActivateProjectPopUp