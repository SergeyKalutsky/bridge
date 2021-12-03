import Popup from 'reactjs-popup';
import Project from './Projects'

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    project: Project
}

const ActiveteProjectPopUp = ({ open, setOpen, project }: Props): JSX.Element => {
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
                <button className="close">
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