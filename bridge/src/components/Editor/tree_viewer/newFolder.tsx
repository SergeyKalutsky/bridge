import { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import Popup from 'reactjs-popup';

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
            <Popup
                open={open}
                onClose={() => { setOpen(false) }}
                closeOnDocumentClick
                position="right center"
                modal>
                <div className="modal">
                    <div>Введите название директории</div>
                    <input type="text" onChange={(e) => { setfoldername(e.target.value) }} />
                    <button className="close" onClick={() => {
                        window.projects.createFolder({ activePath: activePath, name: foldername });
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

export default NewFolder