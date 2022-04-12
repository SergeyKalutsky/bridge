import { FILE_ICONS } from "../Constants";
import { AiOutlineFile } from "react-icons/ai";
import { IDE } from "../types";


interface Props {
  name: string
  path: string
  ide: IDE
  setIDE: React.Dispatch<React.SetStateAction<IDE>>
}

const File = ({ name, path, ide, setIDE }: Props): JSX.Element => {
  const savePath = () => {
    const activeProject = window.settings.get('active_project')
    activeProject.activePath = { path: path, isDirectory: false }
    window.settings.set({ active_project: activeProject })
  }
  const ext = name.split(".")[1];
  const bgColor = ide.activePath !== undefined && path === ide.activePath.path ? 'bg-slate-700' : 'bg-transparent'
  return (
    <div className={`pl-[20px] flex items-center ${bgColor} hover:bg-slate-700 hover:cursor-pointer`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIDE({ ...ide, activePath: { path: path, isDirectory: false } });
        savePath()
      }}>
      {FILE_ICONS[ext] || <AiOutlineFile />}
      <span className="ml-[5px] text-[18px] text-white overflow-hidden whitespace-nowrap text-ellipsis">{name}</span>
    </div>
  );
};

export default File