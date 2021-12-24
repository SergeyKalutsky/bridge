import { useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import InputForm from "../../common/InputForm";
import PopUp from "../../common/PopUp";
import Button from "../../common/Button";

interface ActivePath {
    path: string
    isDirectory: boolean
}

interface Props {
    activePath: ActivePath
    forceUpdate: () => void
}


const NewFile = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const [filename, setFilename] = useState('')
    const [open, setOpen] = useState(false)
    return (
        <>
            <AiOutlineFileAdd onClick={() => { setOpen(true) }} className="hover:bg-neutral-500 hover:rounded-full" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div>Введите название файла</div>
                <InputForm type="text" onChange={(e) => { setFilename(e.target.value) }} placeholder="Введите название файла" />
                <Button  onClick={() => {
                    window.projects.createFile({ activePath: activePath, name: filename });
                    forceUpdate()
                    setOpen(false)
                }} btnText="ОК" />
            </PopUp>
        </>
    )
}

export default NewFile