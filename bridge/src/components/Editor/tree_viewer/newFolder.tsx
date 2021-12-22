import { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import Popup from 'reactjs-popup';
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


const NewFolder = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const [foldername, setfoldername] = useState('')
    const [open, setOpen] = useState(false)
    return (
        <>
            <AiOutlineFolderAdd onClick={() => { setOpen(true) }} />
            <PopUp
                open={open}
                onClose={() => { setOpen(false) }}>
                <div>Введите название директории</div>
                <InputForm type="text" onChange={(e) => { setfoldername(e.target.value) }} placeholder="Введите название папки" />
                <Button onClick={() => {
                    window.projects.createFolder({ activePath: activePath, name: foldername });
                    forceUpdate()
                    setOpen(false)
                }} btnText="ОК" />
            </PopUp>
        </>
    )
}

export default NewFolder