import { IoMdGitCommit, IoMdPlay } from 'react-icons/io'
import { FaLongArrowAltDown, FaLongArrowAltUp, FaStop } from 'react-icons/fa'
import { IconButton } from "../common";
import { useContext, useEffect, useState } from 'react';
import { ideContext } from './Editor';
import { CMD } from './Constants'

interface ExecControl {
    type: string
    jsx: JSX.Element
}

interface GitStatus {
    canCommit: boolean
    canPush: boolean
}

export function ActionControllIcons(): JSX.Element {
    const { ide } = useContext(ideContext)
    const [gitStatus, setGitStatus] = useState<GitStatus>({ canCommit: false, canPush: false })
    const http = window.settings.get('userProjects.activeProject.http')
    const [execControl, setExecControl] = useState<ExecControl>(
        {
            type: 'play',
            jsx: <IoMdPlay style={{ color: '#76de85', height: 30, width: 35 }} />
        }
    )

    useEffect(() => {
        const setInitPush = async () => {
            if (!(http && ide?.branch)) return
            const headPos = await window.git.headPositonLocal({ branch: ide.branch, url: http })
            console.log(headPos)
        }
        setInitPush()
        const interval = setInterval(async () => {
            const status = await window.git.status()
            if (status.length > 0) {
                setGitStatus({
                    canCommit: true,
                    canPush: true
                })
            }
        }, 2000)
        return () => { clearInterval(interval) };
    }, [ide?.branch])

    useEffect(() => {
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
        return () => window.shared.removeListeners("terminal:incomingdata")
    }, [])


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

    function handleCommitClick() {
        if (!gitStatus.canCommit) return
        window.git.commit()
        setGitStatus({
            canCommit: false,
            canPush: true
        })
    }


    return (
        <div className="w-2/4 flex justify-end">
            <div className={!http ? 'justify-start flex w-[160px] gap-x-4' :
                'flex justify-between w-[160px] mr-10 h-1/5'}>
                <IconButton onClick={onClick}>
                    {execControl.jsx}
                </IconButton>
                <div className="flex">
                    <IconButton onClick={handleCommitClick}>
                        <IoMdGitCommit style={{
                            color: gitStatus.canCommit ? 'white' : 'grey',
                            height: 45,
                            width: 45,
                            cursor: gitStatus.canCommit ? 'auto' : 'not-allowed'
                        }} />
                    </IconButton>
                    {http ?
                        <>
                            <IconButton>
                                <FaLongArrowAltDown style={{ color: 'white', height: 30, width: 30, textDecorationColor: 'white' }} />
                            </IconButton>
                            <IconButton>
                                <FaLongArrowAltUp style={{
                                    color: gitStatus.canPush ? 'white' : 'grey',
                                    height: 30,
                                    width: 30,
                                    cursor: gitStatus.canPush ? 'auto' : 'not-allowed'
                                }} />
                            </IconButton>
                        </> : null}
                </div>
            </div>
        </div>
    )
}