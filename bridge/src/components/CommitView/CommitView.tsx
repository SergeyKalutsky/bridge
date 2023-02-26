import { IDE, FileObject } from "./types";
import buildEditor from "./TextEditor";
import FileTreeView from "./file-tree-view/FileTreeView";
import { ACE_MODS } from './Constants'
import { useHistory } from 'react-router-dom'
import { useEffect, useState, createContext } from "react";
import { ToggleBar, SideMenu, Workspace, ToolBar } from "../common";
import { Tree } from "./file-tree-view/Tree";
import { BsArrowLeft } from "react-icons/bs";


interface IDEContext {
    ide: IDE,
    setIDE: React.Dispatch<React.SetStateAction<IDE>>
    buildFileTree: (files: FileObject[]) => JSX.Element[]
}

export const ideContext = createContext<IDEContext>(null)


function ReturnButton(): JSX.Element {
    const history = useHistory()
    async function handleClick() {
        await window.git.checkoutBranch({ branch: 'master' });
        history.push('/git')
    }
    return (
        <div className='flex justify-center items-center h-[70px]' onClick={handleClick}>
            <div className='w-[96%] flex justify-start items-center'>
                <div className='w-[130px] flex items-center hover:cursor-pointer rounded-lg hover:bg-zinc-600/60 pl-2 pr-2 pt-1 pb-1'>
                    <BsArrowLeft
                        //  onClick={onclick} 
                        style={{ width: 35, height: 35, color: '#e2e8f0' }} />
                    <span className="ml-2 text-slate-200 font-semibold text-2xl">Назад</span>
                </div>
            </div>
        </div>
    )
}

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
                        <ReturnButton />
                    </ToolBar>
                    <div className="w-full flex-1 flex flex-col">
                        {ide ? ide.editor : null}
                    </div>
                </Workspace>
            </ideContext.Provider>
        </>
    );
}