import { useState } from "react";
import { IDE, FileObject } from "../types";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { InputForm, PopUp, Button } from "../../common";

interface Props {
    ide: IDE
    updateFileTree: (ide: IDE) => void
}


const RenameFile = ({ ide, updateFileTree }: Props): JSX.Element => {
    const [filename, setFilename] = useState('')
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        const filePath = window.projects.renameFile({ activePath: ide.activePath, newName: filename });
        const updateFiles = (files: FileObject[]) => {
            const newfiles = []
            for (const file of files) {
                if (file.path === ide.activePath.path) {
                    file.path = filePath
                    file.name = filename
                }
                if (file.isDirectory) {
                    newfiles.push({ ...file, files: updateFiles(file.files) })
                } else {
                    newfiles.push(file)
                }
            }
            return newfiles
        }
        updateFileTree({
            ...ide,
            activePath: { isDirectory: ide.activePath.isDirectory, path: filePath },
            files: updateFiles(ide.files)
        })
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