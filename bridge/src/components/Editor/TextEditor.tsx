import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-monokai";


const buildEditor = (mode = 'plain_text',
    value = 'Cоздайте или выберите файл, чтобы начать работу',
    readOnly = false,
    onChange=null): JSX.Element => {
    return <AceEditor
        mode={mode}
        theme="monokai"
        value={value}
        name="aceEditor"
        style={{ width: 'none', height: 'none', flexGrow: 1 }}
        readOnly={readOnly}
        editorProps={{ $blockScrolling: true }}
        onLoad={editorInstance => {
            document.addEventListener("mouseup", e => (
                editorInstance.resize()
            ));
        }}
        onChange={onChange}
        fontSize={18}
    />
}

export default buildEditor