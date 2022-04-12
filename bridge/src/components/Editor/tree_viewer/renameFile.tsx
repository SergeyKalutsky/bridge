import { useState } from "react";
import { IDE } from "../types";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { InputForm, PopUp, Button } from "../../common";

interface Props {
    ide: IDE
    setIDE: React.Dispatch<React.SetStateAction<IDE>>
}


const RenameFile = ({ ide, setIDE }: Props): JSX.Element => {
    const [filename, setFilename] = useState('')
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        const filePath = window.projects.renameFile({ activePath: ide.activePath, newName: filename });
        setIDE({ ...ide, activePath: { isDirectory: ide.activePath.isDirectory, path: filePath } })
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