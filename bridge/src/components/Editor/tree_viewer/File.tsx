import { FILE_ICONS } from "../Constants";
import { AiOutlineFile } from "react-icons/ai";
import { IDE } from "../types";
import { ACE_MODS } from '../Constants'
import buildEditor from '../TextEditor'


interface Props {
  name: string
  path: string
  ide: IDE
  setIDE: React.Dispatch<React.SetStateAction<IDE>>
}

// window.shared.incomingData('projects:readactivefile', (data) => {
//   const onChange = (newValue: string) => {
//       window.projects.writeActiveFile({ filepath: data.path, fileContent: newValue })
//   }
//   if (IMG_FORMATS.includes(data.ext)) {
//       // if its an image folder we don't load editor
//       const imgDisplay = <><div className="position: relative flex-grow flex-shrink basis-0 overflow-scroll">
//           <img src={data.path} alt="" className="max-w-lg" /></div></>
//       setIDE({ ...ide, editor: imgDisplay })
//       return
//   }
//   if (data.path === '') {
//       setIDE({ ...ide, editor: buildEditor() })
//       return
//   }
//   setIDE({ ...ide, editor: buildEditor(ACE_MODS[data.ext], data.content, false, onChange) })

// })
// return () => window.shared.removeListeners('projects:readactivefile')

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
        console.log(content)
        setIDE({
          ...ide,
          activePath: { path: path, isDirectory: false },
          editor: buildEditor(ACE_MODS[ext], content, false, onChange)
        });
        savePath()
      }}>
      {FILE_ICONS[ext] || <AiOutlineFile />}
      <span className="ml-[5px] text-[18px] text-white overflow-hidden whitespace-nowrap text-ellipsis">{name}</span>
    </div>
  );
};

export default File