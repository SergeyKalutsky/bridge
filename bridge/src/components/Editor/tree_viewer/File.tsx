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
  background-color: ${p => (p.active ? "#f3f0f7" : "transparent")};
  span {
    margin-left: 5px;
    font-size: 18px;
  }
  &:hover {
    background-color: #f3f0f7;
    cursor: pointer;
  }
`;

interface ActivePath {
  path: string
  isDirectory: boolean
}

interface Props {
  name: string
  path: string
  activePath: ActivePath
  setActivePath: React.Dispatch<React.SetStateAction<ActivePath>>
}

const File = ({ name, path, activePath, setActivePath }: Props): JSX.Element => {
  const ext = name.split(".")[1];
  return (
    <StyledFile active={activePath !== null && path === activePath.path}
      onClick={() => { setActivePath({ path: path, isDirectory: false })}}>
      {FILE_ICONS[ext] || <AiOutlineFile />}
      <span>{name}</span>
    </StyledFile>
  );
};

export default File