import { FILE_ICONS } from "../Constants";
import { AiOutlineFile } from "react-icons/ai";
import { IDE } from "../types";
import { ACE_MODS, IMG_FORMATS } from '../Constants'
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
    const activeProject = window.settings.get('active_project')
    activeProject.activePath = { path: path, isDirectory: false }
    window.settings.set({ active_project: activeProject })
  }
  const extList = path.split(".")
  const ext = extList[extList.length - 1]
  const bgColor = ide.activePath !== undefined && path === ide.activePath.path ? 'bg-slate-700' : 'bg-transparent'
  return (
    <div className={`pl-[20px] flex items-center ${bgColor} hover:bg-slate-700 hover:cursor-pointer`}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const onChange = (newValue: string) => {
          window.projects.writeActiveFile({ filepath: path, fileContent: newValue })
        }
        const content = await window.projects.readActiveFile(path)
        setIDE({
          ...ide,
          activePath: { path: path, isDirectory: false },
          editor: IMG_FORMATS.includes(ext) ?
            (<div className="position: relative flex-grow flex-shrink basis-0 overflow-scroll">
              <img src={path} alt="" className="max-w-lg" /></div>) :
            buildEditor(ACE_MODS[ext], content, false, onChange)
        });
        savePath()
      }}>
      {FILE_ICONS[ext] || <AiOutlineFile />}
      <span className="ml-[5px] text-[18px] text-white overflow-hidden whitespace-nowrap text-ellipsis">{name}</span>
    </div>
  );
};

export default File