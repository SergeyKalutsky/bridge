import PopUp from '../../common/PopuUp';
import Button from '../../common/Button';
import { UserProjects, Project } from '../types'
import { useContext } from 'react';
import { projectContext } from '../Projects';

type Props = {
    open: boolean
    projectDelete: Project
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeleteProjectPopUp({ projectDelete, open, setOpen }: Props): JSX.Element {
    const { userProjects, setUserProjects } = useContext(projectContext);
    const handleClick = () => {
        if (projectDelete.name === userProjects.activeProject.name) {
            window.settings.del('active_project');
        }
        window.projects.delete(projectDelete.name);
        setUserProjects({
            ...userProjects,
            projects: userProjects.projects.filter((project) => { return project.name != projectDelete.name; })
        });

        setOpen(false);
    };
    return (
        <PopUp
            open={open}
            onClose={() => { setOpen(false); } }>
            <div>Вы уверены, что хотите удалить проект?</div>
            <Button onClick={handleClick} btnText='Удалить' />
        </PopUp>
    );
}
