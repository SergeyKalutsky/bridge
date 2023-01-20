import { FILE_ICONS } from "../Constants";
import { AiOutlineFile } from "react-icons/ai";
import { IDE } from "../types";
import { ACE_MODS } from '../Constants'
import buildEditor from '../TextEditor'


interface Props {
  name: string
  path: string
  children?: JSX.Element
  ide: IDE
  setIDE: React.Dispatch<React.SetStateAction<IDE>>
}


const File = ({ name, path, ide, setIDE }: Props): JSX.Element => {
  const savePath = () => {
    const userProjects = window.settings.get('userProjects')
    userProjects.activeProject.activePath = { path: path, isDirectory: false }
    window.settings.set({ userProjects: userProjects })
  }
  const extList = path.split(".")
  const ext = extList[extList.length - 1]
  const bgColor = ide.activePath !== undefined && path === ide.activePath.path ? 'bg-slate-700' : 'bg-transparent'
  return (
    <div className={`pl-[20px] flex items-center ${bgColor} hover:bg-slate-700 hover:cursor-pointer`}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIDE({
          ...ide,
          activePath: { path: path, isDirectory: false },
          editor: await buildEditor(ACE_MODS[ext], false, path)
        });
        savePath()
      }}>
      {FILE_ICONS[ext] || <AiOutlineFile />}
      <span className="ml-[5px] text-[18px] text-white overflow-hidden whitespace-nowrap text-ellipsis">{name}</span>
    </div>
  );
};

export default File