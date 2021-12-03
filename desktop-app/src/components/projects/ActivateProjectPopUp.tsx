import Popup from 'reactjs-popup';
import Project from './Projects'

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    project: Project
    setPopUp: (active_project: Project) => void

}

const ActiveteProjectPopUp = ({ open, setOpen, project, setPopUp }: Props): JSX.Element => {
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
                <button className="close" onClick={() => {
                    const active_project = {
                        name: project.name,
                        id: project.id,
                        isclassroom: project.isclassroom,
                        isuserowner: 1,
                        islocal: true
                    }
                    setPopUp(active_project)
                }}>
                    Скачать
                </button>
                <button className="close" onClick={() => {
                    const active_project = {
                        name: project.name,
                        id: project.id,
                        isclassroom: project.isclassroom,
                        isuserowner: 1,
                        islocal: true
                    }
                    setPopUp(active_project)
                }}>
                    Удалить
                </button>
            </div>
        </Popup>
    )
}

export default ActiveteProjectPopUp