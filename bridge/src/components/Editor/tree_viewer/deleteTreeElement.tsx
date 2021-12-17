import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import Popup from 'reactjs-popup';

interface ActivePath {
    path: string
    isDirectory: boolean
}

interface Props {
    activePath: ActivePath
    forceUpdate: () => void
}


const DeleteTreeElement = ({ activePath, forceUpdate }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <AiFillDelete onClick={() => { setOpen(true) }} />
            <Popup
                open={open}
                onClose={() => { setOpen(false) }}
                closeOnDocumentClick
                position="right center"
                modal>
                <div className="modal">
                    <div>Файл/Директория будут удалены</div>
                    <button className="close" onClick={() => {
                        window.projects.deleteTreeElement(activePath);
                        forceUpdate()
                        setOpen(false)
                    }}>
                        Удалить
                    </button>
                    <button className="close" onClick={() => {
                        setOpen(false)
                    }}>
                        Закрыть
                    </button>
                </div>
            </Popup>
        </>
    )
}

export default DeleteTreeElement