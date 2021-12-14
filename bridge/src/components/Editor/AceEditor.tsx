import AceEditor from "react-ace";
import XtermTerminal from "./XtermTerminal";
import '../../assets/css/editor.css'

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";


const Editor = (): JSX.Element => {

    const onChange = (newValue: string) => {
        console.log("change", newValue);
    }

    return (
        <div className="ide">
            <div className="tree-view">
            </div>
            <div className="editor">
                <AceEditor
                    mode="python"
                    theme="github"
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