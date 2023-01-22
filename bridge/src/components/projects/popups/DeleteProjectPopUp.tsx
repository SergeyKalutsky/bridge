import PopUp from '../../common/PopuUp';
import Button from '../../common/Button';
import { Project } from '../types'
import { useContext } from 'react';
import { projectContext } from '../Projects';


export default function DeleteProjectPopUp({ projectDelete, open, onClose }: {
    open: boolean
    projectDelete: Project
    onClose: () => void
}): JSX.Element {
    const { deleteProject, dispatch } = useContext(projectContext);
    const handleClick = () => {
        deleteProject(projectDelete)
        onClose()
        dispatch({ type: 'home' })
    };
    return (
        <PopUp
            open={open}
            onClose={() => { onClose() }}>
            <div>Вы уверены, что хотите удалить проект?</div>
            <Button onClick={handleClick} btnText='Удалить' />
        </PopUp>
    );
}
