import { Button } from "../common";
import { BsGithub } from 'react-icons/bs'
import { FaTrashAlt, FaKey } from 'react-icons/fa'
import { AiFillFolderOpen } from 'react-icons/ai'

export function RowWithButton({ className, text, btnTheme, btnText, onClick, icon }: {
    className?: string,
    text: string;
    btnText: string;
    btnTheme?: string;
    onClick?: () => void;
    icon: string
}): JSX.Element {
    const icons = {
        trash: <FaTrashAlt style={{ width: 30, height: 30, color: '#e2e8f0' }} />,
        github: <BsGithub style={{ width: 30, height: 30, color: '#e2e8f0' }} />,
        key: <FaKey style={{ width: 30, height: 30, color: '#e2e8f0' }} />,
        folder: <AiFillFolderOpen style={{ width: 30, height: 30, color: '#e2e8f0' }} />
    }
    return (
        <div className={`w-full h-[80px] flex justify-between items-center bg-zinc-600/50 shadow-sm rounded-lg ${className}`}>
            <div className="ml-3 flex justify-start items-center">
                {icons[icon]}
                <span className="ml-3 text-slate-200 font-semibold text-lg">{text}</span>
            </div>
            <Button className="mr-3" theme={btnTheme} btnText={btnText} onClick={onClick} />
        </div>);
}
