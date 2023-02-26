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


export default async function buildEditor(mode = 'plain_text',
    readOnly = true,
    path = null): Promise<JSX.Element> {
    let fileContent = '';
    if (path) {
        fileContent = await window.projects.readActiveFile(path);
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
            readOnly={true}
            editorProps={{ $blockScrolling: true }}
            onLoad={editorInstance => {
                document.addEventListener("mouseup", () => (
                    editorInstance.resize()
                ));
            }}
            fontSize={18} />;

    return editorView;
}
