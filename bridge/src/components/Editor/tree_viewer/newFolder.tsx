import { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { IDE, FileObject } from "../types";
import { InputForm, PopUp, Button } from "../../common";


interface Props {
    ide: IDE
    updateFileTree: (ide: IDE) => void
}


const NewFolder = ({ ide, updateFileTree }: Props): JSX.Element => {
    const [foldername, setfoldername] = useState('')
    const [open, setOpen] = useState(false)
    const handleClick = async () => {
        const filePath = await window.projects.createFolder({ activePath: ide.activePath, name: foldername });
        const updateFiles = (files: FileObject[]) => {
            const newfiles = []
            for (const file of files) {
                if (file.path === ide.activePath.path) {
                    const newFile = { name: foldername, path: filePath, isDirectory: true, files: [] }
                    file.isDirectory ? file.files.push(newFile) : newfiles.push(newFile)
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
            <AiOutlineFolderAdd onClick={() => { setOpen(true) }} className="hover:bg-neutral-500 hover:rounded-full" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div className="w-4/5">
                    <InputForm type="text" onChange={(e) => { setfoldername(e.target.value) }} placeholder="Введите название папки" />
                </div>
                <Button onClick={handleClick} btnText="ОК" />
            </PopUp>
        </>
    )
}

export default NewFolder