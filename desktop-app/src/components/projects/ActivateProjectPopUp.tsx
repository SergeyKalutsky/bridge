import { ipcRenderer } from 'electron';
import { useContext } from 'react';
import Popup from 'reactjs-popup';
import Project from './Projects'
import { SettingsContext } from '../../App'
import { deleteMember } from '../../lib/api/index'

interface Props {
    open: boolean
    project: Project
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setProject: React.Dispatch<React.SetStateAction<Project>>
}

const ActivateProjectPopUp = ({ open, setOpen, project, setProject }: Props): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    return (
        <Popup
            open={open}
            onClose={() => setOpen(false)}
            closeOnDocumentClick
            position="right center"
            key={project.name}
            modal>
            <div className="modal">
                <div>Проект отсутствует локально</div>
                <button className="close"
                    onClick={() => {
                        ipcRenderer.send('git', { cmd: 'clone', project: project, user: settings.user })
                        setOpen(false)
                        setProject({ ...project, islocal: true })
                    }}
                >
                    Скачать
                </button>
                <button className="close"
                    onClick={() => {
                        console.log(project.id, settings.user.id)
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