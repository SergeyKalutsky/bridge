import { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { ActivePath } from "../types";
import { InputForm, PopUp, Button } from "../../common";

interface Props {
    activePath: ActivePath
    forceUpdate: () => void
}


const NewFolder = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const [foldername, setfoldername] = useState('')
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        window.projects.createFolder({ activePath: activePath, name: foldername });
        forceUpdate()
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