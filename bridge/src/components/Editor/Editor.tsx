import { useEffect, useState } from "react";
import { ActivePath } from "./types";
import { CMD, ACE_MODS } from './Constants'
import { ToggleBar, SideMenu, Workspace, ToolBar, Button } from "../common";

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
                window.terminal.keystoke(`${excecutable} ${activePath.path}`)
                window.terminal.keystoke('\r')
            }
        }
    }
    useEffect(() => {
        window.shared.incomingData('projects:readactivefile', (data) => {
            const onChange = (newValue: string) => {
                window.projects.writeActiveFile({ filepath: data.path, fileContent: newValue })
                console.log(newValue)
            }
            setEditor(buildEditor(ACE_MODS[data.ext], data.content, false, onChange))
        })

    }, [])

    useEffect(() => {
        if (activePath !== null && !activePath.isDirectory) {

            window.projects.readActiveFile(activePath.path)

        }
    }, [activePath])
    return (
        <>
            <SideMenu activeToggle={activeToggle}>
                <FileTreeView activePath={activePath} setActivePath={setActivePath} />
            </SideMenu>
            <ToggleBar handleToggle={handleToggle} />
            <Workspace>
                <ToolBar>
                    <div className="w-full flex justify-end">
                        <div className="flex justify-between w-[270px] mr-5 h-2/5">
                            <Button onClick={() => { window.git.push() }}
                                btnText='commit' theme="purple" height={5} >
                            </Button>
                            <Button onClick={handleClick} theme="purple" height={5}>
                                <span>RUN</span>
                            </Button>
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