import { useContext, useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { InputForm, PopUp } from "../../common";
import { ideContext } from "../Editor";


const NewFile = (): JSX.Element => {
    const [open, setOpen] = useState(false)
    const { ide, setIDE, buildFileTree } = useContext(ideContext)
    const handleEnter = async (event) => {
        if (event.key !== 'Enter') return
        await window.projects.createFile({ activePath: ide.activePath, name: event.target.value });
        setIDE({
            ...ide,
            files: await window.projects.showFiles(),
            fileTree: buildFileTree(ide, ide.files[0].files)
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
                    <InputForm type="text" handleKeyPress={handleEnter} placeholder="Название файла" />
                </div>
            </PopUp>
        </>
    )
}

export default NewFile