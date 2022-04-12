import { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { IDE } from "../types";
import { InputForm, PopUp, Button } from "../../common";

interface Props {
    ide: IDE
    setIDE: React.Dispatch<React.SetStateAction<IDE>>
}


const NewFolder = ({ ide, setIDE }: Props): JSX.Element => {
    const [foldername, setfoldername] = useState('')
    const [open, setOpen] = useState(false)
    const handleClick = async () => {
    const filePath = await window.projects.createFolder({ activePath: ide.activePath, name: foldername });
        setIDE({ ...ide, activePath: { isDirectory: ide.activePath.isDirectory, path: filePath } })
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