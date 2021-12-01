import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";


const Editor = (): JSX.Element => {

    const onChange = (newValue: string) => {
        console.log("change", newValue);
    }

    return (
        <AceEditor
            mode="python"
            theme="github"
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
        />
    )
}

export default Editor