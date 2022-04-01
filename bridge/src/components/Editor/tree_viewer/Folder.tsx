import { useState, useEffect, useRef } from "react";
import { ActivePath } from "../types";
import { AiOutlineFolder } from "react-icons/ai";

interface Props {
  children: JSX.Element[] | JSX.Element
  name: string
  path: string
  activePath: ActivePath
  setActivePath: React.Dispatch<React.SetStateAction<ActivePath>>
}

const Folder = ({ name, children, path, activePath, setActivePath }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState('bg-transperent')
  const ref = useRef(null)
  const handleToggle = e => {
    setActivePath({ path: path, isDirectory: true })
    const activeProject = window.settings.get('active_project')
    activeProject.activePath = { path: path, isDirectory: false }
    window.settings.set({active_project: activeProject})
    e.preventDefault()
    setIsOpen(!isOpen)
  };

  useEffect(() => {
    const onDragEnter = (e) => {
      setColor("bg-slate-700")
    }
    ref.current.addEventListener('dragenter', onDragEnter)
  }, [])

  useEffect(() => {
    const onDragLeave = (e) => {
      setColor("bg-transperent")
    }
    ref.current.addEventListener('dragleave', onDragLeave)
  }, [])

  useEffect(() => {
    const drop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setColor("bg-transperent")

      for (const f of e.dataTransfer.files) {
        window.projects.copyFile({ src: f.path, destination: path, root: false })
      }
    }
    ref.current.addEventListener('drop', drop)
    ref.current.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }, [])
  const bgColor = activePath !== null && path === activePath.path ? "bg-slate-700" : "bg-transperent"
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