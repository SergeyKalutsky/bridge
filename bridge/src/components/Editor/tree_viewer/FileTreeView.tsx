import styled from "styled-components";
import Folder from "./Folder";
import File from "./File"
import NewFile from "./NewFile";
import NewFolder from './newFolder'
import SideMenuHeader from "../../common/SideMenuHeader";
import { IconContext } from "react-icons";
import { useEffect, useState } from "react";
import DeleteTreeElement from './deleteTreeElement'

const StyledTree = styled.div`
  line-height: 1.5;
`;

const Tree = ({ children }) => {
    return <StyledTree>{children}</StyledTree>;
};

Tree.File = File;
Tree.Folder = Folder;

interface FileObject {
    name: string
    files?: FileObject[]
    path: string
    isDirectory: boolean
}

interface ActivePath {
    path: string
    isDirectory: boolean
}

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

    // sets initial file structure
    useEffect(() => {
        window.projects.showFiles()
            .then(val => setFileTree(buildFileTree(val)))
    }, [update])

    // updates active selected path
    useEffect(() => {
        if (fileTree !== null) {
            setFileTree(updateFileTree(fileTree))
        }
    }, [activePath])

    const settigns = window.settings.get()
    return (
        <>
            <SideMenuHeader>
                <div className="grow flex justify-center items-center overflow-hidden">
                    <span className='text-white text-4xl text-ellipsis'>{settigns.active_project.name}</span>
                </div>
                <div className="w-[100px] flex hover:bg-sky-900 rounded-full cursor-pointer justify-end mr-4">
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