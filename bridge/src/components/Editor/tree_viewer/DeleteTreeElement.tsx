import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IDE, FileObject } from "../types";
import { PopUp, Button } from "../../common";


interface Props {
    ide: IDE
    updateFileTree: (ide: IDE, files: FileObject[]) => void
}




const DeleteTreeElement = ({ ide, updateFileTree }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        window.projects.deleteTreeElement(ide.activePath)
        window.settings.del('active_project.activePath')
        // setIDE({ ...ide, activePath: undefined })
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