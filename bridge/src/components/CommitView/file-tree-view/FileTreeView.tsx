import { SideMenuHeader } from "../../common";
import { IconContext } from "react-icons";
import { Tree } from "./Tree";
import { useContext } from "react";
import { ideContext } from "../CommitView";


export default function FileTreeView(): JSX.Element {
    const { ide } = useContext(ideContext)
    const activeProject = window.settings.get('userProjects.activeProject');
    return (
        <>
            <SideMenuHeader>
                <div className="grow flex justify-center items-center">
                    <span className='text-white font-medium text-2xl w-[100px] grow text-ellipsis overflow-hidden whitespace-nowrap ml-3'>{activeProject.name}</span>
                </div>
            </SideMenuHeader>
            <Tree >
                {ide !== undefined ? ide.fileTree : null}
            </Tree>
        </>
    );
}
