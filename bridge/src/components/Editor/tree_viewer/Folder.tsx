import { useState } from "react";
import styled from "styled-components";
import { AiOutlineFolder } from "react-icons/ai";

const StyledFolder = styled.div`
  padding-left: 20px;

  .folder--label {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
      font-size: 20px;
    }
  .folder--label .active {
      background-color: "#f3f0f7"
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
    setActivePath({ path: path, isDirectory: true })
    e.preventDefault()
    setIsOpen(!isOpen)
  };
  return (
    <StyledFolder>
      <div className={activePath !== null && path === activePath.path ? "folder--label active" : "folder--label"}
        onClick={handleToggle}>
        <AiOutlineFolder />
        <span>{name}</span>
      </div>
      <Collapsible isOpen={isOpen}>{children}</Collapsible>
    </StyledFolder>
  );
};

export default Folder