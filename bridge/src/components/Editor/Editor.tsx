import { IDE, FileObject } from "./types";
import Xterm from "./Xterm";
import buildEditor from "./TextEditor";
import FileTreeView from "./file-tree-view/FileTreeView";
import { ACE_MODS } from './Constants'
import { useEffect, useState, createContext } from "react";
import { ToggleBar, SideMenu, Workspace, ToolBar } from "../common";
import { Tree } from "./file-tree-view/Tree";
import { BranchMenu } from "./BranchMenu";
import { ActionControllIcons } from "./ActionControlIcons";


interface IDEContext {
    ide: IDE,
    setIDE: React.Dispatch<React.SetStateAction<IDE>>
    buildFileTree: (ide: IDE, files: FileObject[]) => JSX.Element[]
}

export const ideContext = createContext<IDEContext>(null)

export default function Editor(): JSX.Element {
    const [activeToggle, setActiveToggle] = useState(false);
    const [ide, setIDE] = useState<IDE>();


    function buildFileTree(ide: IDE, files: FileObject[]): JSX.Element[] {
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
                    children={buildFileTree(ide, file.files)} />);
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
            setIDE({
                ...ide,
                activePath: activePath,
                files: await window.projects.showFiles(),
                editor: editor
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
                        <BranchMenu />
                        <ActionControllIcons />
                    </ToolBar>
                    <div className="w-full flex-1 flex flex-col">
                        {ide ? ide.editor : null}
                        <Xterm />
                    </div>
                </Workspace>
            </ideContext.Provider>
        </>
    );
}