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
    e.preventDefault()
    setIsOpen(!isOpen)
  };

  useEffect(() => {
    const onDragEnter = (e) => {
      console.log('File is in the Drop Space')
      setColor("bg-slate-700")
    }
    ref.current.addEventListener('dragenter', onDragEnter)
    return () => ref.current.removeEventListener('dragenter', onDragEnter)
  }, [])

  useEffect(() => {
    const onDragLeave = (e) => {
      console.log('File has left the Drop Space')
      setColor("bg-transperent")
    }
    ref.current.addEventListener('dragleave', onDragLeave)
    return () => ref.current.removeEventListener('dragleave', onDragLeave)
  }, [])

  useEffect(() => {
    setColor(bgColor)
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