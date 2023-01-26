import buildEditor from '../TextEditor'
import { AiFillFile } from "react-icons/ai";
import { FILE_ICONS, ACE_MODS } from "../Constants";
import { useContext } from 'react';
import { ideContext } from '../Editor';


export default function File({ name, path }: {
  name: string;
  path: string;
  children?: JSX.Element;
}): JSX.Element {
  const { ide, setIDE } = useContext(ideContext)
  const savePath = () => {
    const userProjects = window.settings.get('userProjects');
    userProjects.activeProject.activePath = { path: path, isDirectory: false };
    window.settings.set({ userProjects: userProjects });
  };

  const extList = path.split(".");
  const ext = extList[extList.length - 1];
  const bgColor = ide.activePath && path === ide.activePath.path ? 'bg-slate-700' : 'bg-transparent';
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
        savePath();
      }}>
      {FILE_ICONS[ext] || <AiFillFile style={{ color: '#dbeafe' }} />}
      <span className="ml-[5px] text-[18px] text-white overflow-hidden whitespace-nowrap text-ellipsis">{name}</span>
    </div>
  );
}
