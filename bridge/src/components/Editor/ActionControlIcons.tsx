import { IoMdGitCommit, IoMdPlay } from 'react-icons/io'
import { FaLongArrowAltDown, FaLongArrowAltUp, FaStop } from 'react-icons/fa'
import { IconButton } from "../common";
import { useContext, useState } from 'react';
import { ideContext } from './Editor';
import { CMD } from './Constants'

interface ExecControl {
    type: string
    jsx: JSX.Element
}

export function ActionControllIcons(): JSX.Element {
    const { ide } = useContext(ideContext)

    const [execControl, setExecControl] = useState<ExecControl>(
        {
            type: 'play',
            jsx: <IoMdPlay style={{ color: '#76de85', height: 30, width: 35 }} />
        }
    )
    window.shared.incomingData("terminal:incomingdata", (data: string) => {
        const terminalHandle = window.sessionStorage.getItem('terminalHandle')
        if (data.includes(terminalHandle)) {
            setExecControl(
                {
                    type: 'play',
                    jsx: <IoMdPlay style={{ color: '#76de85', height: 30, width: 35 }} />
                }
            )
        }
    });

    function onClick() {
        if (execControl.type === 'play') {
            if (ide.activePath.isDirectory) return
            const extList = ide.activePath.path.split(".");
            const ext = extList[extList.length - 1];
            const excecutable = CMD[ext];
            if (!excecutable) return
            window.terminal.exec({ exec: excecutable, path: '"' + ide.activePath.path + '"' });
            setExecControl(
                {
                    type: 'stop',
                    jsx: <FaStop style={{ color: '#d91a1a', height: 30, width: 35 }} />
                }
            )
            return
        }
        window.terminal.keystoke('\x03')
    }
    return (
        <div className="w-2/4 flex justify-end">
            <div className="flex justify-between w-[160px] mr-10 h-1/5">
                <IconButton onClick={onClick}>
                    {execControl.jsx}
                </IconButton>
                <div className="flex">
                    <IconButton onClick={() => { window.git.commit(); }}>
                        <IoMdGitCommit style={{ color: 'white', height: 45, width: 45 }} />
                    </IconButton>
                    <IconButton>
                        <FaLongArrowAltDown style={{ color: 'white', height: 30, width: 30, textDecorationColor: 'white' }} />
                    </IconButton>
                    <IconButton>
                        <FaLongArrowAltUp style={{ color: 'grey', height: 30, width: 30, textDecorationColor: 'white', cursor: 'not-allowed' }} />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}