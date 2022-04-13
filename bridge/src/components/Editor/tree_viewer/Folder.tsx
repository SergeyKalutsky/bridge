import { useState, useEffect, useRef } from "react";
import { IDE } from "../types";
import { AiOutlineFolder } from "react-icons/ai";

interface Props {
  children: JSX.Element[] | JSX.Element
  name: string
  path: string
  ide: IDE
  setIDE: React.Dispatch<React.SetStateAction<IDE>>
}

const Folder = ({ name, children, path, ide, setIDE }: Props): JSX.Element => {
  const open = JSON.parse(window.localStorage.getItem(path))
  const [isOpen, setIsOpen] = useState(open === null ? false : open);
  const [color, setColor] = useState('bg-transperent')
  const ref = useRef(null)
  const handleToggle = e => {
    e.preventDefault();
    e.stopPropagation();
    setIDE({ ...ide, activePath: { path: path, isDirectory: true } })
    const activeProject = window.settings.get('active_project')
    activeProject.activePath = { path: path, isDirectory: false }
    window.settings.set({ active_project: activeProject })
    e.preventDefault()
    setIsOpen(!isOpen)
    window.localStorage.setItem(path, JSON.stringify(!isOpen))
  };

  useEffect(() => {
    const onDragLeave = (e) => {
      setColor("bg-transperent")
    }
    ref.current.addEventListener('dragleave', onDragLeave)
  }, [])

  useEffect(() => {
    const drop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setColor("bg-transperent")

      for (const f of e.dataTransfer.files) {
        await window.projects.copyFile({ src: f.path, destination: path, root: false })
      }
      const files = await window.projects.showFiles()
      setIDE({ ...ide, files: files })
    }
    ref.current.addEventListener('drop', drop)
    ref.current.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setColor("bg-slate-700")
    });
  }, [])
  const bgColor = ide.activePath !== undefined && path === ide.activePath.path ? "bg-slate-700" : "bg-transperent"
  const height = isOpen ? "h-0" : "h-auto"
  return (
    <div ref={ref} className={`pl-[20px] ${color}`}>
      <div className={`${bgColor} flex items-center hover:bg-slate-700 hover:cursor-pointer`}
        onClick={handleToggle}>
        <span className="text-white"><AiOutlineFolder /></span>
        <span className="ml-[5px] text-[20px] text-white text-ellipsis overflow-hidden whitespace-nowrap">{name}</span>
      </div>
      <div className={`overflow-hidden ${height}`}>{children}</div>
    </div>
  );
};

export default Folder