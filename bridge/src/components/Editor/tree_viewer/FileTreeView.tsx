import styled from "styled-components";
import Folder from "./Folder";
import File from "./File"

const StyledTree = styled.div`
  line-height: 1.5;
`;

const Tree = ({ children }) => {
    return <StyledTree>{children}</StyledTree>;
};

Tree.File = File;
Tree.Folder = Folder;

const FileTreeViewer = (): JSX.Element => {
    return (
        <div className="App">
            <Tree>
                <Tree.Folder name="src">
                    <Tree.Folder name="Components">
                        <Tree.File name="Modal.js" />
                        <Tree.File name="Modal.css" />
                    </Tree.Folder>
                    <Tree.File name="index.js" />
                    <Tree.File name="index.html" />
                </Tree.Folder>
                <Tree.File name="package.json" />
            </Tree>
        </div>
    );
}

export default FileTreeViewer