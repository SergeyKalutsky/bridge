import Popup from 'reactjs-popup';
import { Project } from './Projects'

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    project: Project
    setPopUp: (active_project: Project) => void

}

const SelectActiveProjectPopUp = ({ open, setOpen, project, setPopUp }: Props): JSX.Element => {
    return (
        <Popup
            open={open}
            onClose={() => setOpen(false)}
            closeOnDocumentClick
            position="right center"
            key={project.name}
            modal>
            <div className="modal">
                <div>Проект выбран как основной</div>
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
                    ОК
                </button>
            </div>
        </Popup>
    )
}

export default SelectActiveProjectPopUp