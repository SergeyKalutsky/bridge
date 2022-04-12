import { useState } from "react";
import { IDE, FileObject } from "../types";
import { AiOutlineFileAdd } from "react-icons/ai";
import { InputForm, PopUp, Button } from "../../common";

interface Props {
    ide: IDE
    updateFileTree: (ide: IDE) => void
}


const NewFile = ({ ide, updateFileTree }: Props): JSX.Element => {
    const [filename, setFilename] = useState('')
    const [open, setOpen] = useState(false)
    const handleClick = async () => {
        const filePath = await window.projects.createFile({ activePath: ide.activePath, name: filename });
        const updateFiles = (files: FileObject[]) => {
            const newfiles = []
            for (const file of files) {
                if (file.path === ide.activePath.path) {
                    newfiles.push({ name: filename, path: filePath, isDirectory: false })
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
            files: updateFiles(ide.files)
        })
        setOpen(false)
    }
    return (
        <>
            <AiOutlineFileAdd onClick={() => { setOpen(true) }} className="hover:bg-neutral-500 hover:rounded-full" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div className="w-4/5">
                    <InputForm type="text" onChange={(e) => { setFilename(e.target.value) }} placeholder="Введите название файла" />
                </div>
                <Button onClick={handleClick} btnText="ОК" />
            </PopUp>
        </>
    )
}

export default NewFile