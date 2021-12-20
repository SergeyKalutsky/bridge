import PopUp from '../common/PopUp'
import Button from '../common/Button'
import { Project } from './types'

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    project: Project
    setPopUp: (active_project: Project) => void
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectActiveProject = ({ open, setOpen, project, setPopUp, setActive }: Props): JSX.Element => {
    const closeModal = () => { setOpen(false); setActive(false) }
    const selectActiveProject = () => {
        const active_project = {
            name: project.name,
            id: project.id,
            isclassroom: project.isclassroom,
            isuserowner: 1,
            islocal: true,
            http: ''
        }
        setPopUp(active_project)
    }
    return (
        <PopUp
            open={open}
            onClose={closeModal}
            key={project.name}
        >
            <div className='text-xl font-medium mb-2'>Выбрать проект как основной</div>
            <Button onClick={selectActiveProject} btnText='ОК' />
        </PopUp>
    )
}

export default SelectActiveProject