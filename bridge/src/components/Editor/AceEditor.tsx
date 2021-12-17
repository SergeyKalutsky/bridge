import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import XtermTerminal from "./XtermTerminal";
import FileTreeViewer from "./tree_viewer/FileTreeView";
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

const Editor = (): JSX.Element => {
    const [activePath, setActivePath] = useState<ActivePath>(null)
    const [editor, setEditor] = useState(null)

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
                {editor}
                <XtermTerminal activePath={activePath}/>
            </div>
        </div>
    )
}

export default Editor