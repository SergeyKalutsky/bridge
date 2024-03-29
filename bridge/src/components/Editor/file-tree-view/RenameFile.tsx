import { useState, useEffect, useContext } from "react";
import { InputForm, PopUp } from "../../common";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { ideContext } from '../Editor';


function RenameFile(): JSX.Element {
    const [filename, setFilename] = useState('');
    const [open, setOpen] = useState(false);
    const { setIDE, ide, buildFileTree } = useContext(ideContext)

    const handleEnter = async (event) => {
        if (event.key !== 'Enter') return
        const filePath = window.projects.renameFile({ activePath: ide.activePath, newName: event.target.value })
        const files = await window.projects.showFiles()
        setIDE({
            ...ide,
            activePath: { isDirectory: ide.activePath.isDirectory, path: filePath },
            files: files,
            fileTree: buildFileTree(files[0].files)
        });
        setOpen(false)
    }

    useEffect(() => {
        if (!ide?.activePath) return
        setFilename(window.projects.getFileBasename({ filepath: ide.activePath.path }))
    }, [open]);
    return (
        <>
            <MdDriveFileRenameOutline onClick={() => { setOpen(true); }} className="hover:bg-neutral-500 hover:rounded-full h-[25px]" />
            <PopUp
                open={open}
                onClose={() => { setOpen(false); }}>
                <div className="w-4/5">
                    <InputForm
                        value={filename}
                        handleKeyPress={handleEnter}
                        onChange={(e) => { setFilename(e.target.value) }}
                        type="text"
                        placeholder="Название файла" />
                </div>
            </PopUp>
        </>
    );
}

export default RenameFile