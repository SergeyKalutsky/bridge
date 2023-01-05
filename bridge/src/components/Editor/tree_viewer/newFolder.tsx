import { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { IDE } from "../types";
import { InputForm, PopUp, Button } from "../../common";


interface Props {
    ide: IDE
    updateFileTree: (ide: IDE) => void
}


const NewFolder = ({ ide, updateFileTree }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
    const handleEnter = async (event) => {
        if (event.key !== 'Enter') return
        await window.projects.createFolder({ activePath: ide.activePath, name: event.target.value });
        updateFileTree({
            ...ide,
            files: await window.projects.showFiles()
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
                    <InputForm type="text" handleKeyPress={handleEnter} placeholder="Название папки" />
                </div>
            </PopUp>
        </>
    )
}

export default NewFolder