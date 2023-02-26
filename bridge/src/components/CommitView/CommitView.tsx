import { IDE, FileObject } from "./types";
import buildEditor from "./TextEditor";
import FileTreeView from "./file-tree-view/FileTreeView";
import { ACE_MODS } from './Constants'
import { useEffect, useState, createContext } from "react";
import { ToggleBar, SideMenu, Workspace, ToolBar } from "../common";
import { Tree } from "./file-tree-view/Tree";


interface IDEContext {
    ide: IDE,
    setIDE: React.Dispatch<React.SetStateAction<IDE>>
    buildFileTree: (files: FileObject[]) => JSX.Element[]
}

export const ideContext = createContext<IDEContext>(null)

export default function CommitView(): JSX.Element {
    const [activeToggle, setActiveToggle] = useState(false);
    const [ide, setIDE] = useState<IDE>();


    function buildFileTree(files: FileObject[]): JSX.Element[] {
        const elements = [];
        for (const file of files) {
            if (!file.isDirectory) {
                elements.push(<Tree.File name={file.name}
                    path={file.path}
                    key={file.path} />);
            } else {
                elements.push(<Tree.Folder name={file.name}
                    key={file.path}
                    path={file.path}
                    children={buildFileTree(file.files)} />);
            }
        }
        return elements;
    }

    useEffect(() => {
        const loadActiveFile = async () => {
            let editor = await buildEditor();
            const activePath = window.settings.get('userProjects.activeProject.activePath');
            if (activePath !== undefined && activePath.isDirectory === false) {
                const extList = activePath.path.split(".");
                const ext = extList[extList.length - 1];
                editor = await buildEditor(ACE_MODS[ext], false, activePath.path);
            }
            const branch = await window.git.getCurrentBranch();
            const files = await window.projects.showFiles()
            setIDE({
                ...ide,
                activePath: activePath,
                files: files,
                fileTree: buildFileTree(files[0].files),
                editor: editor,
                branch: branch,
            });
        };
        loadActiveFile();
    }, []);

    return (
        <>
            <ideContext.Provider value={{ ide, setIDE, buildFileTree }}>
                <SideMenu activeToggle={activeToggle}>
                    <FileTreeView />
                </SideMenu>
                <ToggleBar handleToggle={() => { setActiveToggle(!activeToggle); }} />
                <Workspace>
                    <ToolBar>
                    </ToolBar>
                    <div className="w-full flex-1 flex flex-col">
                        {ide ? ide.editor : null}
                    </div>
                </Workspace>
            </ideContext.Provider>
        </>
    );
}