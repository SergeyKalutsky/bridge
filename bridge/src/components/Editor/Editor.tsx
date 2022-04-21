import { useEffect, useState } from "react";
import { IDE } from "./types";
import { CMD, ACE_MODS } from './Constants'
import { ToggleBar, SideMenu, Workspace, ToolBar, IconButton } from "../common";
import { IoMdGitCommit, IoMdPlay } from 'react-icons/io'
import { FaStop } from 'react-icons/fa'

import Xterm from "./Xterm";
import buildEditor from "./TextEditor";
import FileTreeView from "./tree_viewer/FileTreeView";


const Editor = (): JSX.Element => {
    const [activeToggle, setActiveToggle] = useState(false)
    const [ide, setIDE] = useState<IDE>()

    const handleToggle = () => { setActiveToggle(!activeToggle) }

    const handlePlayButtonClick = () => {
        if (!ide.activePath.isDirectory) {
            const extList = ide.activePath.path.split(".")
            const ext = extList[extList.length - 1]
            const excecutable = CMD[ext]
            if (excecutable !== undefined) {
                window.terminal.exec({ exec: excecutable, path: '"'+ide.activePath.path+'"' })
            }
        }
    }
    const handeCanselBattonClick = () => {
        window.terminal.keystoke('\x03')
    }
    useEffect(() => {
        const loadActiveFile = async () => {
            let editor = await buildEditor()
            const activePath = window.settings.get('active_project.activePath')
            if (activePath !== undefined && activePath.isDirectory === false) {
                const extList = activePath.path.split(".")
                const ext = extList[extList.length - 1]
                editor = await buildEditor(ACE_MODS[ext], false, activePath.path)
            }
            setIDE({
                ...ide,
                activePath: activePath,
                files: await window.projects.showFiles(),
                editor: editor
            })
        }
        loadActiveFile()
    }, [])

    return (
        <>
            <SideMenu activeToggle={activeToggle}>
                <FileTreeView ide={ide} setIDE={setIDE} />
            </SideMenu>
            <ToggleBar handleToggle={handleToggle} />
            <Workspace>
                <ToolBar>
                    <div className="w-full flex justify-end">
                        <div className="flex justify-between w-[150px] mr-10 h-1/5">
                            <IconButton onClick={handlePlayButtonClick}>
                                <IoMdPlay style={{ color: '#76de85', height: 30, width: 30 }} />
                            </IconButton>
                            <IconButton onClick={handeCanselBattonClick}>
                                <FaStop style={{ color: '#d91a1a', height: 25, width: 25 }} />
                            </IconButton>
                            <IconButton onClick={() => { window.git.commit() }}>
                                <IoMdGitCommit style={{ color: 'white', height: 50, width: 50 }} />
                            </IconButton>
                        </div>
                    </div>
                </ToolBar>
                <div className="w-full flex-1 flex flex-col">
                    {ide !== undefined? ide.editor : null}
                    <Xterm />
                </div>
            </Workspace>
        </>
    )
}

export default Editor