import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IDE } from "../types";
import { PopUp, Button } from "../../common";


interface Props {
    ide: IDE
    setIDE: React.Dispatch<React.SetStateAction<IDE>>
}



const DeleteTreeElement = ({ ide, setIDE }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <AiFillDelete onClick={() => { setOpen(true) }} className="hover:bg-neutral-500 hover:rounded-full" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div>Файл/Директория будут удалены</div>
                <Button onClick={() => {
                    window.projects.deleteTreeElement(ide.activePath)
                    window.settings.del('active_project.activePath')
                    setIDE({ ...ide, activePath: undefined })
                    setOpen(false)
                }} btnText="Удалить" />
                <Button onClick={() => { setOpen(false) }} btnText="Закрыть" />
            </PopUp>
        </>
    )
}

export default DeleteTreeElement