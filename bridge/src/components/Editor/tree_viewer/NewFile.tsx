import { useState } from "react";
import { IDE } from "../types";
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
        await window.projects.createFile({ activePath: ide.activePath, name: filename });
        updateFileTree({
            ...ide,
            files: await window.projects.showFiles()
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