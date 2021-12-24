import { useEffect, useState } from "react";
import { ActivePath } from "./types";
import ToggleBar from "../common/ToggleBar";
import SideMenu from "../common/SideMenu";
import Workspace from "../common/Workspace";
import AceEditor from "react-ace";
import Xterm from "./Xterm";
import FileTreeView from "./tree_viewer/FileTreeView";
import ToolBar from '../common/ToolBar';
import Button from '../common/Button';

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-plain_text";

import "ace-builds/src-noconflict/theme-monokai";

const CMDS = {
    js: 'node',
    ts: 'ts-node',
    py: 'python'
}


const ACE_MODS = {
    js: 'javascript',
    css: 'css',
    html: 'html',
    jsx: 'javascript',
    py: 'python',
    md: 'markdown',
    txt: 'plain_text'
};


const defaultEditor = (<AceEditor
    mode='plain_text'
    theme="monokai"
    value='Cоздайте или выберите файл, чтобы начать работу'
    name="aceEditor"
    style={{ height: '59%', width: '100%' }}
    readOnly={true}
    editorProps={{ $blockScrolling: true }}
    fontSize={18}
/>)

const Editor = (): JSX.Element => {
    const [activeToggle, setActiveToggle] = useState(false)
    const handleToggle = () => { setActiveToggle(!activeToggle) }
    const [activePath, setActivePath] = useState<ActivePath>(null)
    const [editor, setEditor] = useState(defaultEditor)

    const onChange = (newValue: string) => {
        window.projects.writeActiveFile({ filepath: activePath.path, fileContent: newValue })
    }
    const handleClick = () => {
        if (!activePath.isDirectory) {
            const ext = activePath.path.split(".")[1]
            const excecutable = CMDS[ext]
            if (excecutable !== undefined) {
                window.terminal.keystoke(`${excecutable} ${activePath.path}`)
                window.terminal.keystoke('\r')
            }
        }
    }
    useEffect(() => {
        if (activePath !== null && !activePath.isDirectory) {
            window.projects.readActiveFile(activePath.path)
                .then((value) => {
                    const ext = activePath.path.split(".")[1];
                    const mode = ACE_MODS[ext]
                    setEditor(
                        <AceEditor
                            mode={mode}
                            theme="monokai"
                            value={value}
                            onChange={onChange}
                            style={{ height: '59%', width: '100%' }}
                            name="aceEditor"
                            editorProps={{ $blockScrolling: true }}
                            fontSize={18}
                        />)
                })
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
                {editor}
                <Xterm activeToggle={activeToggle} />
            </Workspace>
        </>
    )
}

export default Editor