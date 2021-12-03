import { ipcRenderer } from 'electron';
import { useContext } from 'react';
import Popup from 'reactjs-popup';
import Project from './Projects'
import { SettingsContext } from '../../App'

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    project: Project
}

const ActiveteProjectPopUp = ({ open, setOpen, project }: Props): JSX.Element => {
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
                        console.log(project)
                        ipcRenderer.send('git', { cmd: 'clone', project: project, user: settings.user })
                        setOpen(false)
                    }}
                >
                    Скачать
                </button>
                <button className="close">
                    Удалить
                </button>
            </div>
        </Popup>
    )
}

export default ActiveteProjectPopUp