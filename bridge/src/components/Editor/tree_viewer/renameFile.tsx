import { useState, useEffect } from "react";
import { IDE } from "../types";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { InputForm, PopUp } from "../../common";
import path from 'path'


interface Props {
    ide: IDE
    updateFileTree: (ide: IDE) => void
}


const RenameFile = ({ ide, updateFileTree }: Props): JSX.Element => {
    const [filename, setFilename] = useState('')
    const [open, setOpen] = useState(false)
    const handleEnter = async (event) => {
        if (event.key !== 'Enter') return
        const filePath = window.projects.renameFile({ activePath: ide.activePath, newName: event.target.value });
        updateFileTree({
            ...ide,
            activePath: { isDirectory: ide.activePath.isDirectory, path: filePath },
            files: await window.projects.showFiles()
        })
        setOpen(false)
    }
    useEffect(() => {
        if (ide === undefined || ide.activePath === undefined) return
        const setFileName = () => setFilename(path.parse(ide.activePath.path).base)
        setFileName()
    })
    return (
        <>
            <MdDriveFileRenameOutline onClick={() => { setOpen(true) }} className="hover:bg-neutral-500 hover:rounded-full h-[25px]" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div className="w-4/5">
                    <InputForm value={filename} handleKeyPress={handleEnter} type="text" placeholder="Название файла" />
                </div>
            </PopUp>
        </>
    )
}

export default RenameFile