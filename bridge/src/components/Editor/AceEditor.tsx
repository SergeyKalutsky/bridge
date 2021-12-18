import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import XtermTerminal from "./XtermTerminal";
import FileTreeViewer from "./tree_viewer/FileTreeView";
import { Button } from '@material-ui/core';
import { Arrow, Refresh } from '../Icons';
import '../../assets/css/editor.css'

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-plain_text";

import "ace-builds/src-noconflict/theme-monokai";


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
                            name="aceEditor"
                            editorProps={{ $blockScrolling: true }}
                            fontSize={18}
                        />)
                })
        }
    }, [activePath])
    return (
        <div className="ide">
            <div className="tree-view">
                <FileTreeViewer activePath={activePath} setActivePath={setActivePath} />
            </div>
            <div className="editor">
                <div className="tool-bar">
                    <Button className="BttnP" color="primary"
                        onClick={() => {
                            window.git.pull()
                        }}>
                        <span>pull</span>
                        <Arrow />
                    </Button>
                    <Button className="BttnP" color="secondary"
                        onClick={() => {
                            window.git.push()
                        }}>
                        <span>commit</span>
                        <div className="ArrUp">
                            <Arrow />
                        </div>
                    </Button>
                    <Button className='auto-update'>
                        <Refresh />
                    </Button>
                </div>
                {editor}
                <XtermTerminal activePath={activePath} />
            </div>
        </div>
    )
}

export default Editor