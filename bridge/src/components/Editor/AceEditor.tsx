import AceEditor from "react-ace";
import XtermTerminal from "./XtermTerminal";
import FileTreeViewer from "./tree_viewer/FileTreeView";
import '../../assets/css/editor.css'

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";


const Editor = (): JSX.Element => {

    const onChange = (newValue: string) => {
        console.log("change", newValue);
    }

    return (
        <div className="ide">
            <div className="tree-view">
                <FileTreeViewer />
            </div>
            <div className="editor">
                <AceEditor
                    mode="python"
                    theme="monokai"
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