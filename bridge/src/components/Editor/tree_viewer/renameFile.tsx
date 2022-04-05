import { useState } from "react";
import { ActivePath } from "../types";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { InputForm, PopUp, Button } from "../../common";

interface Props {
    activePath: ActivePath
    forceUpdate: () => void
}


const RenameFile = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const [filename, setFilename] = useState('')
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        window.projects.renameFile({ activePath: activePath, newName: filename });
        forceUpdate()
        setOpen(false)
    }
    return (
        <>
            <MdDriveFileRenameOutline onClick={() => { setOpen(true) }} className="hover:bg-neutral-500 hover:rounded-full h-[25px]" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div className="w-4/5">
                    <InputForm type="text" onChange={(e) => { setFilename(e.target.value) }} placeholder="Введите новое название файла" />
                </div>
                    <Button onClick={handleClick} btnText="Ок" />
            </PopUp>
        </>
    )
}

export default RenameFile