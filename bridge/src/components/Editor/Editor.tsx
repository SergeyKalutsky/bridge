import { IDE } from "./types";
import { CMD, ACE_MODS } from './Constants'
import { useEffect, useState } from "react";
import { ToggleBar, SideMenu, Workspace, ToolBar, IconButton } from "../common";
import { IoMdGitCommit, IoMdPlay, IoMdGitBranch } from 'react-icons/io'
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa'
import BranchPopUp from "./tree_viewer/BranchPopUp";

import Xterm from "./Xterm";
import buildEditor from "./TextEditor";
import FileTreeView from "./tree_viewer/FileTreeView";


const Editor = (): JSX.Element => {
    const [activeToggle, setActiveToggle] = useState(false)
    const [ide, setIDE] = useState<IDE>()
    const [branch, setBranch] = useState('')
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const setInitBranch = async () => {
            const branch = window.git.getCurrentBranch()
            setBranch(await branch)
        }
        setInitBranch()
    })

    function handleBranchClick() {
        setOpen(true)
    }

    const handleToggle = () => { setActiveToggle(!activeToggle) }

    const handlePlayButtonClick = () => {
        if (!ide.activePath.isDirectory) {
            const extList = ide.activePath.path.split(".")
            const ext = extList[extList.length - 1]
            const excecutable = CMD[ext]
            if (excecutable !== undefined) {
                window.terminal.exec({ exec: excecutable, path: '"' + ide.activePath.path + '"' })
            }
        }
    }
    const handeCanselBattonClick = () => {
        window.terminal.keystoke('\x03')
    }
    useEffect(() => {
        const loadActiveFile = async () => {
            let editor = await buildEditor()
            const activePath = window.settings.get('userProjects.activeProject.activePath')
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
                    <div className="w-2/4 flex justify-start items-center">
                        <div className="ml-10 flex items-center justify-center w-[130px] h-[40px] hover:cursor-pointer rounded-lg hover:bg-zinc-800/60 pl-2 pr-2 pt-1 pb-1"
                            onClick={handleBranchClick}>
                            <IoMdGitBranch style={{ color: 'white', height: 25, width: 25 }} />
                            <span className="text-slate-100 text-2xl ml-2 font-medium">{branch}</span>
                        </div>
                    </div>
                    <div className="w-2/4 flex justify-end">
                        <div className="flex justify-between w-[160px] mr-10 h-1/5">
                            <IconButton onClick={handlePlayButtonClick}>
                                <IoMdPlay style={{ color: '#76de85', height: 30, width: 35 }} />
                            </IconButton>
                            {/* <IconButton onClick={handeCanselBattonClick}>
                                <FaStop style={{ color: '#d91a1a', height: 25, width: 25 }} />
                            </IconButton> */}
                            <div className="flex">
                                <IconButton onClick={() => { window.git.commit() }}>
                                    <IoMdGitCommit style={{ color: 'grey', height: 45, width: 45, cursor: 'not-allowed' }} />
                                </IconButton>
                                <IconButton >
                                    <FaLongArrowAltDown style={{ color: 'white', height: 30, width: 30, textDecorationColor: 'white' }} />
                                </IconButton>
                                <IconButton >
                                    <FaLongArrowAltUp style={{ color: 'grey', height: 30, width: 30, textDecorationColor: 'white', cursor: 'not-allowed' }} />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </ToolBar>
                <div className="w-full flex-1 flex flex-col">
                    {ide !== undefined ? ide.editor : null}
                    <Xterm />
                </div>
            </Workspace>
            <BranchPopUp open={open} setOpen={setOpen} selectedBranch={branch} />
        </>
    )
}

export default Editor