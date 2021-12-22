import { useState } from "react";
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

  const handleToggle = e => {
    setActivePath({ path: path, isDirectory: true })
    e.preventDefault()
    setIsOpen(!isOpen)
  };
  const height = isOpen ? "h-0" : "h-auto"
  const bgColor = activePath !== null && path === activePath.path ? "bg-slate-200" : "bg-transperent"
  return (
    <div className="pl-[20px] hover:bg-slate-200 hover:cursor-pointer">
      <div className={`${bgColor} flex items-center`}
        onClick={handleToggle}>
        <AiOutlineFolder />
        <span className="ml-[5px] text-[20px]">{name}</span>
      </div>
      <div className={`overflow-hidden ${height}`}>{children}</div>
    </div>
  );
};

export default Folder