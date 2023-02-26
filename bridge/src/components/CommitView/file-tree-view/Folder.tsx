import { useState, useEffect, useRef, useContext } from "react";
import { AiFillFolder } from "react-icons/ai";
import { ideContext } from "../CommitView";
import buildEditor from "../TextEditor";

export default function Folder({ name, children, path }: {
  children: JSX.Element[];
  name: string;
  path: string;
}): JSX.Element {
  const [popUp, setPopUp] = useState<JSX.Element>()
  const open = JSON.parse(window.localStorage.getItem(path));
  const [isOpen, setIsOpen] = useState(open === null ? true : open)
  const { ide, setIDE, buildFileTree } = useContext(ideContext)
  const [color, setColor] = useState('bg-transperent')
  const ref = useRef(null);


  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setIDE({ ...ide, activePath: { path: path, isDirectory: true } });

    const userProjects = window.settings.get('userProjects');
    userProjects.activeProject.activePath = { path: path, isDirectory: true };
    setIDE({
      ...ide,
      activePath: { path: path, isDirectory: true },
      editor: await buildEditor('plain_text', false, null)
    });
    window.settings.set({ userProjects: userProjects });
    setIsOpen(!isOpen);
    window.localStorage.setItem(path, JSON.stringify(!isOpen));
  }

  useEffect(() => {
    const onDragLeave = (e) => {
      setColor("bg-transperent");
    };
    ref.current.addEventListener('dragleave', onDragLeave);
  }, []);

  const bgColor = ide.activePath !== undefined && path === ide.activePath.path ? "bg-slate-700" : "bg-transperent";
  const height = isOpen ? "h-0" : "h-auto";
  return (
    <>
      <div
        ref={ref} className={`pl-[20px] ${color}`}>
        <div
          className={`${bgColor} flex items-center hover:bg-slate-700 hover:cursor-pointer`}
          onClick={handleClick}>
          <span ><AiFillFolder style={{ color: '#d97706' }} /></span>
          <span className="ml-[5px] text-[20px] select-none text-white text-ellipsis overflow-hidden whitespace-nowrap">{name}</span>
        </div>
        <div className={`overflow-hidden ${height}`}>{children}</div>
      </div>
      {popUp}
    </>
  );
}
