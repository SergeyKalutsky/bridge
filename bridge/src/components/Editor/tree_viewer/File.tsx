import { FILE_ICONS } from "../Constants";
import { AiOutlineFile } from "react-icons/ai";
import { ActivePath } from "../types";


interface Props {
  name: string
  path: string
  activePath: ActivePath
  setActivePath: React.Dispatch<React.SetStateAction<ActivePath>>
}

const File = ({ name, path, activePath, setActivePath }: Props): JSX.Element => {
  const ext = name.split(".")[1];
  const bgColor = activePath !== null && path === activePath.path ? 'bg-slate-700' : 'bg-transparent'
  return (
    <div className={`pl-[20px] flex items-center ${bgColor} hover:bg-slate-700 hover:cursor-pointer`}
      onClick={() => { setActivePath({ path: path, isDirectory: false }) }}>
      {FILE_ICONS[ext] || <AiOutlineFile />}
      <span className="ml-[5px] text-[18px] text-white overflow-hidden whitespace-nowrap text-ellipsis">{name}</span>
    </div>
  );
};

export default File