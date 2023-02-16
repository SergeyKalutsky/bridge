import { useContext, useState } from "react";
import buildEditor from "../TextEditor";
import { PopUp, Button } from "../../common";
import { AiFillDelete } from "react-icons/ai";
import { ideContext } from "../Editor";


export default function DeleteTreeElement(): JSX.Element {
    const [open, setOpen] = useState(false);
    const { ide, setIDE, buildFileTree } = useContext(ideContext)
    const handleClick = async () => {
        window.projects.deleteTreeElement(ide.activePath);
        window.settings.del('userProjects.activeProject.activePath');
        const files = await window.projects.showFiles()
        setIDE({
            ...ide,
            activePath: { path: files[0].path, isDirectory: true },
            files: files,
            fileTree: buildFileTree(files[0].files),
            editor: await buildEditor()
        });
        setOpen(false);
    };
    return (
        <>
            <AiFillDelete onClick={() => { setOpen(true); }} className="hover:bg-neutral-500 hover:rounded-full" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false); }}>
                <div>Удалить папку/файл?</div>
                <Button onClick={handleClick} btnText="Удалить" />
            </PopUp>
        </>
    );
}
