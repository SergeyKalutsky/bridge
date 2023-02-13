import { PopUp, Button } from "../../common"
import { ActivePath } from "../types";
import { useContext, useState } from "react";
import { ideContext } from "../Editor";


export default function ReplaceFilePopUp({
    draggedPath,
    destination,
    root,
}: {
    destination: string,
    draggedPath: ActivePath
    root: boolean
}): JSX.Element {
    const [open, setOpen] = useState(true)
    const { ide, setIDE } = useContext(ideContext)
    async function replace() {
        await window.projects.copyFile({ src: draggedPath.path, destination: destination, root: root });
        await window.projects.deleteTreeElement(draggedPath)
        const files = await window.projects.showFiles();
        setIDE({ ...ide, files: files });
        setOpen(false)
    }
    return (
        <PopUp
            open={open}
            onClose={() => { setOpen(false) }}>
            <div>В папке уже есть файл с таким именем?</div>
            <Button onClick={replace} btnText="Заменить" />
            <Button onClick={() => setOpen(false)} btnText="Отмена" />
        </PopUp>

    )
}