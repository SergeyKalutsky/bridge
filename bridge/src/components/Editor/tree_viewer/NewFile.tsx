import { useState } from "react";
import { ActivePath } from "../types";
import { AiOutlineFileAdd } from "react-icons/ai";
import { InputForm, PopUp, Button } from "../../common";

interface Props {
    activePath: ActivePath
    forceUpdate: () => void
}


const NewFile = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const [filename, setFilename] = useState('')
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        window.projects.createFile({ activePath: activePath, name: filename });
        forceUpdate()
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