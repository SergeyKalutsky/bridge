import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import XtermTerminal from "./XtermTerminal";
import FileTreeViewer from "./tree_viewer/FileTreeView";
import '../../assets/css/editor.css'

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";


interface ActivePath {
    path: string
    isDirectory: boolean
}

const Editor = (): JSX.Element => {
    const [activePath, setActivePath] = useState<ActivePath>(null)
    const [editorValue, setEditorValue] = useState(null)

    const onChange = (newValue: string) => {
        console.log("change", newValue);
    }
    useEffect(() => {
        if (activePath !== null && !activePath.isDirectory) {
            window.projects.readActiveFile(activePath.path)
                .then(value => setEditorValue(value))
        }
    }, [activePath])
    return (
        <div className="ide">
            <div className="tree-view">
                <FileTreeViewer activePath={activePath} setActivePath={setActivePath} />
            </div>
            <div className="editor">
                <AceEditor
                    mode="python"
                    theme="monokai"
                    value={editorValue}
                    onChange={onChange}
                    name="aceEditor"
                    editorProps={{ $blockScrolling: true }}
                    fontSize={18}
                />
                <XtermTerminal />
            </div>
        </div>
    )
}

export default Editor