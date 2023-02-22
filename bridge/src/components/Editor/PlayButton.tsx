import { IoMdPlay } from 'react-icons/io'
import { IconButton } from "../common";
import { useEffect, useState, useContext } from "react";
import { FaStop } from 'react-icons/fa'
import { CMD } from './Constants'
import { ExecControl } from "./types";
import { ideContext } from './Editor';


export function PlayButton(): JSX.Element {
    const { ide } = useContext(ideContext)
    const [execControl, setExecControl] = useState<ExecControl>(
        {
            type: 'play',
            jsx: <IoMdPlay style={{ color: '#76de85', height: 30, width: 35 }} />
        }
    )

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

    useEffect(() => {
        window.shared.incomingData("terminal:incomingdata", (data: string) => {
            const terminalHandle = window.sessionStorage.getItem('terminalHandle')
            if (data.includes(terminalHandle) && !data.includes('&')) {
                setExecControl(
                    {
                        type: 'play',
                        jsx: <IoMdPlay style={{ color: '#76de85', height: 30, width: 35 }} />
                    }
                )
            }
        });
        return () => window.shared.removeListeners("terminal:incomingdata")
    }, [])
    return (
        <IconButton onClick={onClick}>
            {execControl.jsx}
        </IconButton>
    )
}