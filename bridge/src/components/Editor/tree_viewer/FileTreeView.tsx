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

interface Folder {
    name: string
    files: string[]
}


const FileTreeViewer = (): JSX.Element => {
    const [fileTree, setFileTree] = useState<JSX.Element[]>(null)

    const buildFileTree = (files: string[] | Folder[]): JSX.Element[] => {
        const elements = []
        for (const file of files) {
            if (typeof file === 'string') {
                elements.push(<Tree.File name={file} key={file}/>)
            } else {
                elements.push(<Tree.Folder name={file.name} key={file.name}>
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
            {fileTree}
        </div>
    );
}

export default FileTreeViewer