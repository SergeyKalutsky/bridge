import { useEffect, useState } from "react";
import { ActivePath } from "./types";
import { CMD, ACE_MODS, IMG_FORMATS } from './Constants'
import { ToggleBar, SideMenu, Workspace, ToolBar, IconButton } from "../common";
import { IoMdGitCommit, IoMdPlay } from 'react-icons/io'
import { FaStop } from 'react-icons/fa'

import Xterm from "./Xterm";
import buildEditor from "./TextEditor";
import FileTreeView from "./tree_viewer/FileTreeView";

const Editor = (): JSX.Element => {
    const [activeToggle, setActiveToggle] = useState(false)
    const handleToggle = () => { setActiveToggle(!activeToggle) }
    const [activePath, setActivePath] = useState<ActivePath>(null)
    const [editor, setEditor] = useState(buildEditor())

    const handleClick = () => {
        if (!activePath.isDirectory) {
            const ext = activePath.path.split(".")[1]
            const excecutable = CMD[ext]
            if (excecutable !== undefined) {
                // window.terminal.keystoke('\x03')
                window.terminal.exec({exec: excecutable, path: activePath.path})
                // window.terminal.keystoke(`${excecutable} ${activePath.path}`)
                // window.terminal.keystoke('\r')
            }
        }
    }
    const handeCansel = () => {
        window.terminal.keystoke('\x03')
    }

    useEffect(() => {
        const activeProject = window.settings.get('active_project')
        if (activeProject.activePath !== undefined) {
            setActivePath(activeProject.activePath)
        }
    }, [])

    useEffect(() => {

        window.shared.incomingData('projects:readactivefile', (data) => {
            const onChange = (newValue: string) => {
                window.projects.writeActiveFile({ filepath: data.path, fileContent: newValue })
            }
            if (IMG_FORMATS.includes(data.ext)) {
                // if its an image folder we don't load editor
                setEditor(<><div className="position: relative flex-grow flex-shrink basis-0 overflow-scroll">
                    <img src={data.path} alt="" className="max-w-lg" /></div></>)
            } else {
                setEditor(buildEditor(ACE_MODS[data.ext], data.content, false, onChange))
            }
        })
        return () => window.shared.removeListeners('projects:readactivefile')
    }, [])

    useEffect(() => {
        if (activePath !== null && !activePath.isDirectory) {

            window.projects.readActiveFile(activePath.path)

        }
    }, [activePath])
    return (
        <>
            <SideMenu activeToggle={activeToggle} terminal={true}>
                <FileTreeView activePath={activePath} setActivePath={setActivePath} />
            </SideMenu>
            <ToggleBar handleToggle={handleToggle} />
            <Workspace>
                <ToolBar>
                    <div className="w-full flex justify-end">
                        <div className="flex justify-between w-[150px] mr-10 h-1/5">
                            <IconButton onClick={handleClick}>
                                <IoMdPlay style={{ color: '#76de85', height: 30, width: 30 }} />
                            </IconButton>
                            <IconButton onClick={handeCansel}>
                                <FaStop style={{ color: '#d91a1a', height: 25, width: 25 }} />
                            </IconButton>
                            <IconButton onClick={() => { window.git.commit() }}>
                                <IoMdGitCommit style={{ color: 'white', height: 50, width: 50 }} />
                            </IconButton>
                        </div>
                    </div>
                </ToolBar>
                <div className="w-full flex-1 flex flex-col">
                    {editor}
                    <Xterm activeToggle={activeToggle} />
                </div>
            </Workspace>
        </>
    )
}

export default Editor