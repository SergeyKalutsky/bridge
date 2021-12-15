import styled from "styled-components";
import { AiOutlineFile } from "react-icons/ai";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact } from "react-icons/di";

const FILE_ICONS = {
    js: <DiJavascript1 />,
    css: <DiCss3Full />,
    html: <DiHtml5 />,
    jsx: <DiReact />
};


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

const File = ({ name }) => {
    const ext = name.split(".")[1];

    return (
        <StyledFile>
            {FILE_ICONS[ext] || <AiOutlineFile />}
            <span>{name}</span>
        </StyledFile>
    );
};

export default File