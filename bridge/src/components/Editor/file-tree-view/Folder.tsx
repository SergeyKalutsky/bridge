import { useState, useEffect, useRef, useContext } from "react";
import { AiFillFolder } from "react-icons/ai";
import { ideContext } from "../Editor";
import ReplaceFilePopUp from "./ReplaceFilePopUp";

export default function Folder({ name, children, path }: {
  children: JSX.Element[];
  name: string;
  path: string;
}): JSX.Element {
  const [popUp, setPopUp] = useState<JSX.Element>()
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
      if (e.dataTransfer.files.length > 0) {
        for (const f of e.dataTransfer.files) {
          await window.projects.copyFile({ src: f.path, destination: path, root: false });
        }
      } else {
        const draggedPath = JSON.parse(window.localStorage.getItem('draggedPath'))
        const filename = window.projects.getFileBasename({ filepath: draggedPath.path })
        for (const child of children) {
          const file = window.projects.getFileBasename({ filepath: child.key.toString() })
          if (file === filename) {
            setPopUp(null)
            setPopUp(<ReplaceFilePopUp destination={path} draggedPath={draggedPath} root={false} />)
            return
          }
        }
        await window.projects.copyFile({ src: draggedPath.path, destination: path, root: false });
        await window.projects.deleteTreeElement(draggedPath)
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
    <>
      <div
        ref={ref} className={`pl-[20px] ${color}`}>
        <div
          onMouseDown={() => window.localStorage.setItem('draggedPath', JSON.stringify({ path: path, isDirectory: true }))}
          draggable="true"
          className={`${bgColor} flex items-center hover:bg-slate-700 hover:cursor-pointer`}
          onClick={handleToggle}>
          <span ><AiFillFolder style={{ color: '#d97706' }} /></span>
          <span className="ml-[5px] text-[20px] select-none text-white text-ellipsis overflow-hidden whitespace-nowrap">{name}</span>
        </div>
        <div className={`overflow-hidden ${height}`}>{children}</div>
      </div>
      {popUp}
    </>
  );
}
