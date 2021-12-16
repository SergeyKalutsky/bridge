import { useState } from "react";
import styled from "styled-components";
import { AiOutlineFolder } from "react-icons/ai";

const StyledFolder = styled.div`
  padding-left: 20px;

  .folder--label {
    display: flex;
    align-items: center;
    background-color: ${p => (p.active ? "#f3f0f7" : "transparent")};
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


interface ActivePath {
  path: string
  isDirectory: boolean
}

interface Props {
  children: JSX.Element[] | JSX.Element
  name: string
  path: string
  activePath: ActivePath
  setActivePath: React.Dispatch<React.SetStateAction<ActivePath>>
}


const Folder = ({ name, children, path, activePath, setActivePath }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = e => {
    e.preventDefault()
    setIsOpen(!isOpen)
    setActivePath({path: path, isDirectory: true})
  };
  return (
    <StyledFolder active={activePath !== null && path === activePath.path}>
      <div className="folder--label" 
      onClick={handleToggle}>
        <AiOutlineFolder />
        <span>{name}</span>
      </div>
      <Collapsible isOpen={isOpen}>{children}</Collapsible>
    </StyledFolder>
  );
};

export default Folder