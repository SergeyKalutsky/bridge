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


const Folder = ({ name, children }): JSX.Element => {
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

export default Folder