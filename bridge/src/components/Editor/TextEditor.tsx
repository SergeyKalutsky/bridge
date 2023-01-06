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


const buildEditor = async (mode = 'plain_text',
    readOnly = true,
    path = null): Promise<JSX.Element> => {
    let fileContent = 'Выберите или создайте файл, чтобы начать работать'
    if (path !== null) {
        fileContent = await window.projects.readActiveFile(path)
    }
    const onChange = (newValue: string) => {
        window.projects.writeActiveFile({ filepath: path, fileContent: newValue })
    }
    // If file of type image we do not build AceEditor, just show image instead
    const editorView = mode === 'image' ?
        <div className="position: relative flex-grow flex-shrink basis-0 overflow-scroll">
            <img src={`data:image/jpeg;base64,${await window.projects.loadimagebase64(path)}`} alt="" className="max-w-lg" /></div> :
        <AceEditor
            mode={mode}
            theme="monokai"
            value={fileContent}
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

    return editorView
}

export default buildEditor