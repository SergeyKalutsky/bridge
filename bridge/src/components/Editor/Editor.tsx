import { useEffect, useState } from "react";
import SideMenu from "../common/SideMenu";
import Workspace from "../common/Workspace";
import AceEditor from "react-ace";
import XtermTerminal from "./XtermTerminal";
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


interface ActivePath {
    path: string
    isDirectory: boolean
}

const defaultEditor = (<AceEditor
    mode='plain_text'
    theme="monokai"
    value='Cоздайте или выберите файл, чтобы начать работу'
    name="aceEditor"
    style={{width: 'grow'}}
    readOnly={true}
    editorProps={{ $blockScrolling: true }}
    fontSize={18}
/>)

const Editor = (): JSX.Element => {
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
                            className="h-2/3 w-grow"
                            theme="monokai"
                            value={value}
                            onChange={onChange}
                            name="aceEditor"
                            editorProps={{ $blockScrolling: true }}
                            fontSize={18}
                        />)
                })
        }
    }, [activePath])
    return (
        <>
            <SideMenu>
                <FileTreeView activePath={activePath} setActivePath={setActivePath} />
            </SideMenu>
            <Workspace>
                <ToolBar>
                    <Button onClick={() => { window.git.push() }} btnText='commit'>
                    </Button>
                    <Button onClick={handleClick}>
                        <span>RUN</span>
                    </Button>
                </ToolBar>
                {editor}
                <XtermTerminal activePath={activePath} />
            </Workspace>
        </>
    )
}

export default Editor