import { useState, useEffect, useRef, useContext } from "react";
import { AiFillFolder } from "react-icons/ai";
import { ideContext } from "../Editor";


export default function Folder({ name, children, path }: {
  children: JSX.Element[] | JSX.Element;
  name: string;
  path: string;
}): JSX.Element {
  const open = JSON.parse(window.localStorage.getItem(path));
  const [isOpen, setIsOpen] = useState(open === null ? true : open)
  const { ide, setIDE } = useContext(ideContext)
  const [color, setColor] = useState('bg-transperent')
  const ref = useRef(null);
  const handleToggle = e => {
    e.preventDefault();
    e.stopPropagation();
    setIDE({ ...ide, activePath: { path: path, isDirectory: true } });

    const userProjects = window.settings.get('userProjects');
    userProjects.activeProject.activePath = { path: path, isDirectory: true };
    window.settings.set({ userProjects: userProjects });
    setIsOpen(!isOpen);
    window.localStorage.setItem(path, JSON.stringify(!isOpen));
  };

  useEffect(() => {
    const onDragLeave = (e) => {
      setColor("bg-transperent");
    };
    ref.current.addEventListener('dragleave', onDragLeave);
  }, []);

  useEffect(() => {
    const drop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setColor("bg-transperent");

      for (const f of e.dataTransfer.files) {
        await window.projects.copyFile({ src: f.path, destination: path, root: false });
      }
      const files = await window.projects.showFiles();
      setIDE({ ...ide, files: files });
    };
    ref.current.addEventListener('drop', drop);
    ref.current.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setColor("bg-slate-700");
    });
  }, []);
  const bgColor = ide.activePath !== undefined && path === ide.activePath.path ? "bg-slate-700" : "bg-transperent";
  const height = isOpen ? "h-0" : "h-auto";
  return (
    <div 
    ref={ref} className={`pl-[20px] ${color}`} onMouseDown={() => console.log('folder')}>
      <div
        draggable="true"
        className={`${bgColor} flex items-center hover:bg-slate-700 hover:cursor-pointer`}
        onClick={handleToggle}>
        <span ><AiFillFolder style={{ color: '#d97706' }} /></span>
        <span className="ml-[5px] text-[20px] select-none text-white text-ellipsis overflow-hidden whitespace-nowrap">{name}</span>
      </div>
      <div className={`overflow-hidden ${height}`}>{children}</div>
    </div>
  );
}
