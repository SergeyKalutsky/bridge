import NewFile from "./NewFile";
import NewFolder from './NewFolder'
import RenameFile from "./RenameFile";
import { SideMenuHeader } from "../../common";
import { IconContext } from "react-icons";
import DeleteTreeElement from './DeleteTreeElement'
import { Tree } from "./Tree";
import { useContext } from "react";
import { ideContext } from "../Editor";


export default function FileTreeView(): JSX.Element {
    const { ide } = useContext(ideContext)
    const activeProject = window.settings.get('userProjects.activeProject');
    return (
        <>
            <SideMenuHeader>
                <div className="grow flex justify-center items-center">
                    <span className='text-white font-medium text-2xl w-[100px] grow text-ellipsis overflow-hidden whitespace-nowrap ml-3'>{activeProject.name}</span>
                </div>
                <div className="w-[100px] flex rounded-full cursor-pointer justify-end mx-3">
                    <IconContext.Provider value={{ color: 'white', size: '25', className: 'file-icon' }}>
                        <RenameFile />
                        <NewFile />
                        <NewFolder />
                        <DeleteTreeElement />
                    </IconContext.Provider>
                </div>
            </SideMenuHeader>
            <Tree >
                {ide !== undefined ? ide.fileTree : null}
            </Tree>
        </>
    );
}
