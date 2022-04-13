import Folder from "./Folder";
import File from "./File"
import NewFile from "./NewFile";
import NewFolder from './newFolder'
import RenameFile from "./renameFile";
import { FileObject, IDE } from '../types'
import SideMenuHeader from "../../common/SideMenuHeader";
import { IconContext } from "react-icons";
import { useEffect, useState, useRef } from "react";
import DeleteTreeElement from './DeleteTreeElement'


const Tree = ({ children, ide, setIDE }) => {
    const [color, setColor] = useState('bg-transperent')
    const ref = useRef(null)
    useEffect(() => {
        const onDragLeave = (e) => {
            setColor("bg-transperent")
        }
        ref.current.addEventListener('dragleave', onDragLeave)
    }, [])

    useEffect(() => {
        const drop = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            setColor("bg-transperent")

            for (const f of e.dataTransfer.files) {
                await window.projects.copyFile({ src: f.path, destination: '', root: true })
            }
            const files = await window.projects.showFiles()
            setIDE({ ...ide, files: files })
        }
        ref.current.addEventListener('drop', drop)
        ref.current.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setColor("bg-slate-700")
        });
    }, [])

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIDE({
            ...ide,
            activePath: { path: ide.files[0].path, isDirectory: true }
        })

    }

    return <div ref={ref} onClick={handleClick} className={`leading-8 h-[calc(100%-40px)] ${color} overflow-y-scroll`}>{children}</div>
};

Tree.File = File;
Tree.Folder = Folder;


interface Props {
    ide: IDE
    setIDE: React.Dispatch<React.SetStateAction<IDE>>
}

const FileTreeView = ({ ide, setIDE }: Props): JSX.Element => {

    const buildFileTree = (ide: IDE, files: FileObject[]): JSX.Element[] => {
        const elements = []
        for (const file of files) {
            if (!file.isDirectory) {
                elements.push(<Tree.File name={file.name}
                    path={file.path}
                    ide={ide}
                    setIDE={setIDE}
                    key={file.path} />)
            } else {
                elements.push(<Tree.Folder name={file.name}
                    key={file.path}
                    ide={ide}
                    setIDE={setIDE}
                    path={file.path}
                    children={buildFileTree(ide, file.files)} />)
            }
        }
        return elements
    }

    const updateFileTree = (ide: IDE): void => {
        setIDE(
            {
                ...ide,
                fileTree: buildFileTree(ide, ide.files[0].files)
            }
        )
    }

    useEffect(() => {
        const setInitFileTree = async () => {
            const files = await window.projects.showFiles()
            setIDE({ ...ide, files: files })
        }
        setInitFileTree()
    }, [])

    const active_project = window.settings.get('active_project')
    return (
        <>
            <SideMenuHeader>
                <div className="grow flex justify-center items-center">
                    <span className='text-white font-medium text-2xl w-[100px] grow text-ellipsis overflow-hidden whitespace-nowrap ml-3' >{active_project.name}</span>
                </div>
                <div className="w-[100px] flex rounded-full cursor-pointer justify-end mx-3">
                    <IconContext.Provider value={{ color: 'white', size: '25', className: 'file-icon' }}>
                        <RenameFile ide={ide} updateFileTree={updateFileTree} />
                        <NewFile ide={ide} updateFileTree={updateFileTree} />
                        <NewFolder ide={ide} updateFileTree={updateFileTree} />
                        <DeleteTreeElement ide={ide} updateFileTree={updateFileTree} />
                    </IconContext.Provider>
                </div>
            </SideMenuHeader>
            <Tree ide={ide} setIDE={setIDE}>
                {ide.files !== null ? buildFileTree(ide, ide.files[0].files) : null}
            </Tree>
        </>
    );
}

export default FileTreeView