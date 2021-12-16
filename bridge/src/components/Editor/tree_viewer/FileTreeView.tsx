import styled from "styled-components";
import Folder from "./Folder";
import File from "./File"
import { useEffect, useState } from "react";

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

const FileTreeViewer = ({activePath, setActivePath}: Props): JSX.Element => {
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

    useEffect(() => {
        window.projects.showFiles()
            .then(val => setFileTree(buildFileTree(val)))
    }, [])

    
    return (
        <div className="App">
            <Tree>
                {fileTree}
            </Tree>
        </div>
    );
}

export default FileTreeViewer