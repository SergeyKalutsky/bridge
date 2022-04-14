import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IDE } from "../types";
import { PopUp, Button } from "../../common";
import buildEditor from "../TextEditor";


interface Props {
    ide: IDE
    updateFileTree: (ide: IDE) => void
}




const DeleteTreeElement = ({ ide, updateFileTree }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
    const handleClick = async () => {
        window.projects.deleteTreeElement(ide.activePath)
        window.settings.del('active_project.activePath')
        updateFileTree({
            ...ide,
            activePath: { path: ide.files[0].path, isDirectory: true },
            files: await window.projects.showFiles(),
            editor: await buildEditor()
        })
        setOpen(false)
    }
    return (
        <>
            <AiFillDelete onClick={() => { setOpen(true) }} className="hover:bg-neutral-500 hover:rounded-full" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div>Файл/Директория будут удалены</div>
                <Button onClick={handleClick} btnText="Удалить" />
                <Button onClick={() => { setOpen(false) }} btnText="Закрыть" />
            </PopUp>
        </>
    )
}

export default DeleteTreeElement