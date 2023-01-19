import PopUp from '../../common/PopuUp';
import Button from '../../common/Button';
import { Project } from '../types'
import { useContext } from 'react';
import { projectContext } from '../Projects';


export default function DeleteProjectPopUp({ projectDelete, open, setOpen }: {
    open: boolean
    projectDelete: Project
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
    const { deleteProject, dispatch } = useContext(projectContext);
    const handleClick = () => {
        deleteProject(projectDelete)
        setOpen(false);
        dispatch({ type: 'home' })
    };
    return (
        <PopUp
            open={open}
            onClose={() => { setOpen(false); }}>
            <div>Вы уверены, что хотите удалить проект?</div>
            <Button onClick={handleClick} btnText='Удалить' />
        </PopUp>
    );
}
