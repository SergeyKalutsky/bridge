import Folder from "./Folder";
import File from "./File"
import NewFile from "./NewFile";
import NewFolder from './newFolder'
import { ActivePath, FileObject } from '../types'
import SideMenuHeader from "../../common/SideMenuHeader";
import { IconContext } from "react-icons";
import { useEffect, useState, useRef } from "react";
import DeleteTreeElement from './DeleteTreeElement'


const Tree = ({ children }) => {
    const [color, setColor] = useState('bg-transperent')
    const ref = useRef(null)
    useEffect(() => {
        const onDragLeave = (e) => {
            console.log('exit')
            setColor("bg-transperent")
        }
        ref.current.addEventListener('dragleave', onDragLeave)
    }, [])

    useEffect(() => {
        const drop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setColor("bg-transperent")

            for (const f of e.dataTransfer.files) {
                window.projects.copyFile({ src: f.path, destination: '', root: true })
            }
        }
        ref.current.addEventListener('drop', drop)
        ref.current.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setColor("bg-slate-700")
        });
    }, [])
    return <div ref={ref} className={`leading-8 h-2/3 ${color}`}>{children}</div>
};

Tree.File = File;
Tree.Folder = Folder;


interface Props {
    activePath: ActivePath
    setActivePath: React.Dispatch<React.SetStateAction<ActivePath>>
}

const FileTreeView = ({ activePath, setActivePath }: Props): JSX.Element => {
    const [update, setUpdate] = useState(false)
    const [fileTree, setFileTree] = useState<JSX.Element[]>(null)
    const buildFileTree = (files: FileObject[]): JSX.Element[] => {
        const elements = []
        for (const file of files) {
            if (!file.isDirectory) {
                elements.push(<Tree.File name={file.name}
                    path={file.path}
                    activePath={activePath}
                    setActivePath={setActivePath}
                    key={file.path} />)
            } else {
                elements.push(<Tree.Folder name={file.name}
                    key={file.path}
                    activePath={activePath}
                    setActivePath={setActivePath}
                    path={file.path}>
                    {buildFileTree(file.files)}
                </Tree.Folder>)
            }
        }
        return elements
    }

    const forceUpdate = () => {
        setUpdate(!update)
    }

    const updateFileTree = (fileTree: JSX.Element[]): JSX.Element[] => {
        const elements = []
        for (const file of fileTree) {
            if (file.props.children === undefined) {
                elements.push(<Tree.File name={file.props.name}
                    path={file.props.path}
                    activePath={activePath}
                    setActivePath={setActivePath}
                    key={file.props.path} />)
            } else {
                elements.push(<Tree.Folder name={file.props.name}
                    key={file.props.path}
                    activePath={activePath}
                    setActivePath={setActivePath}
                    path={file.props.path}>
                    {updateFileTree(file.props.children)}
                </Tree.Folder>)
            }
        }
        return elements
    }

    useEffect(() => {
        window.shared.incomingData('projects:listfiles', (data) => {
            setFileTree(buildFileTree(data))
        })
        return () => window.shared.removeListeners('projects:listfiles')
    }, [])

    // sets initial file structure
    useEffect(() => {
        window.projects.showFiles()
    }, [update])

    // updates active selected path
    useEffect(() => {
        if (fileTree !== null) {
            setFileTree(updateFileTree(fileTree))
        }
    }, [activePath])

    const active_project = window.settings.get('active_project')
    return (
        <>
            <SideMenuHeader>
                <div className="grow flex justify-center items-center">
                    <span className='text-white font-medium text-2xl w-[100px] grow text-ellipsis overflow-hidden whitespace-nowrap ml-3' >{active_project.name}</span>
                </div>
                <div className="w-[100px] flex rounded-full cursor-pointer justify-end mx-3">
                    <IconContext.Provider value={{ color: 'white', size: '25', className: 'file-icon' }}>
                        <NewFile activePath={activePath} forceUpdate={forceUpdate} />
                        <NewFolder activePath={activePath} forceUpdate={forceUpdate} />
                        <DeleteTreeElement activePath={activePath} forceUpdate={forceUpdate} />
                    </IconContext.Provider>
                </div>
            </SideMenuHeader>
            <Tree>
                {fileTree}
            </Tree>
        </>
    );
}

export default FileTreeView