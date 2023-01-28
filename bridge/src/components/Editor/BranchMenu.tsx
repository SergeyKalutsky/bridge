import { useContext, useState } from 'react';
import { IoMdGitBranch } from 'react-icons/io'
import { ideContext } from './Editor';
import BranchPopUp from "./file-tree-view/BranchPopUp";

export function BranchMenu(): JSX.Element {
    const [open, setOpen] = useState(false);
    const { ide } = useContext(ideContext)
    return (
        <>
            <div className="w-2/4 flex justify-start items-center">
                <div className="ml-10 flex items-center justify-center w-[200px] h-[40px] hover:cursor-pointer rounded-lg hover:bg-zinc-800/60 pl-2 pr-2 pt-1 pb-1"
                    onClick={() => { setOpen(true); }}>
                    <IoMdGitBranch style={{ color: 'white', height: 30, width: 30 }} />
                    <span className="text-slate-100 grow text-2xl ml-2 font-medium text-ellipsis whitespace-nowrap truncate">
                        {ide?.branch}
                    </span>
                </div>
            </div>
            <BranchPopUp open={open} setOpen={setOpen} selectedBranch={ide?.branch} />
        </>

    )
}