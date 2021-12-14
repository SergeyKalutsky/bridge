import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact } from "react-icons/di";

const FILE_ICONS = {
    js: <DiJavascript1 />,
    css: <DiCss3Full />,
    html: <DiHtml5 />,
    jsx: <DiReact />
};

const StyledTree = styled.div`
  line-height: 1.5;
`;
const StyledFile = styled.div`
  padding-left: 20px;
  display: flex;
  align-items: center;
  span {
    margin-left: 5px;
    font-size: 18px;
  }
  &:hover {
    background-color: #f3f0f7;
    cursor: pointer;
  }
`;
const StyledFolder = styled.div`
  padding-left: 20px;

  .folder--label {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
      font-size: 20px;
    }
    &:hover {
        background-color: #f3f0f7;
        cursor: pointer;
    }
  }

`;
const Collapsible = styled.div`
  height: ${p => (p.isOpen ? "0" : "auto")};
  overflow: hidden;
`;

const File = ({ name }) => {
    const ext = name.split(".")[1];

    return (
        <StyledFile>
            {FILE_ICONS[ext] || <AiOutlineFile />}
            <span>{name}</span>
        </StyledFile>
    );
};

const Folder = ({ name, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = e => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <StyledFolder>
            <div className="folder--label" onClick={handleToggle}>
                <AiOutlineFolder />
                <span>{name}</span>
            </div>
            <Collapsible isOpen={isOpen}>{children}</Collapsible>
        </StyledFolder>
    );
};

const Tree = ({ children }) => {
    return <StyledTree>{children}</StyledTree>;
};

Tree.File = File;
Tree.Folder = Folder;

export default function FileTreeViewer(): JSX.Element {
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
