import { useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import Popup from 'reactjs-popup';

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
            <AiOutlineFileAdd onClick={() => { setOpen(true) }} />
            <Popup
                open={open}
                onClose={() => { setOpen(false) }}
                closeOnDocumentClick
                position="right center"
                modal>
                <div className="modal">
                    <div>Введите название файла</div>
                    <input type="text" onChange={(e) => { setFilename(e.target.value) }} />
                    <button className="close" onClick={() => {
                        window.projects.createFile({ activePath: activePath, name: filename });
                        forceUpdate()
                        setOpen(false)
                    }}>
                        ОК
                    </button>
                </div>
            </Popup>
        </>
    )
}

export default NewFile