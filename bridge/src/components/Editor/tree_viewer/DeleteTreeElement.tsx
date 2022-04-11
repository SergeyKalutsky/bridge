import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { ActivePath } from "../types";
import { PopUp, Button } from "../../common";


interface Props {
    activePath: ActivePath
    forceUpdate: () => void
}


const DeleteTreeElement = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <AiFillDelete onClick={() => { setOpen(true) }} className="hover:bg-neutral-500 hover:rounded-full" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div>Файл/Директория будут удалены</div>
                <Button onClick={() => {
                    window.projects.deleteTreeElement(activePath)
                    window.settings.del('active_project.activePath')
                    forceUpdate()
                    window.projects.readActiveFile('')
                    setOpen(false)
                }} btnText="Удалить" />
                <Button onClick={() => { setOpen(false) }} btnText="Закрыть" />
            </PopUp>
        </>
    )
}

export default DeleteTreeElement