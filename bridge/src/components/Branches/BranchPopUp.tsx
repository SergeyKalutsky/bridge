import { useContext, useEffect, useState } from 'react'
import { PopUp, InputForm } from '../common'
import { IoMdGitBranch } from 'react-icons/io'
import { ideContext } from '../Editor/Editor';
import { FileObject } from '../Editor/types';
import buildEditor from '../Editor/TextEditor';
import { ACE_MODS } from '../Editor/Constants';


function BranchRow({ branch, setOpen }: {
    branch: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
    const { ide, setIDE, buildFileTree } = useContext(ideContext)
    async function onClick() {
        await window.git.checkoutBranch({ branch: branch });
        const activePath = await window.settings.get('userProjects.activeProject.activePath')
        const files = await window.projects.showFiles()
        const checkPathExists = (files: FileObject[]): boolean => {
            if (!files) return false
            for (const file of files) {
                if (!file.isDirectory && file.path === activePath.path) {
                    return true
                } else {
                    return checkPathExists(file.files)
                }
            }
            return false
        }
        const exist = checkPathExists(files)
        let editor: JSX.Element
        if (exist) {
            const extList = activePath.path.split(".");
            const ext = extList[extList.length - 1];
            editor = await buildEditor(ACE_MODS[ext], false, activePath.path)
        } else {
            editor = await buildEditor()
        }

        setIDE({
            ...ide,
            branch: branch,
            files: files,
            fileTree: buildFileTree(files[0].files),
            activePath: exist ? ide.activePath : null,
            editor: editor
        })
        setOpen(false)
    }
    return (<div
        onClick={onClick}
        className={`pl-2 hover: cursor-pointer hover:bg-sky-400/20 text-slate-800 text-xl flex items-center w-full h-[40px]`}>
        <IoMdGitBranch style={{ color: '#18181b', height: 23, width: 23, marginRight: '3px' }} />
        {branch}
    </div>);

}

const BranchPopUp = ({ open, setOpen, selectedBranch }: {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedBranch: string
}): JSX.Element => {
    const [branches, setBranches] = useState<JSX.Element[]>([])
    useEffect(() => {
        const branches = async () => {
            const branches = await window.git.listBranches()
            setBranches(branches.map(branch => branch === selectedBranch ?
                null : <BranchRow branch={branch} key={branch} setOpen={setOpen} />))
        }
        branches()
    }, [selectedBranch])
    return (
        <PopUp
            open={open}
            onClose={() => { setOpen(false) }}
            height={90}
            width={60}
            opacity={100}
        >
            <div className='h-full w-10/12 pt-5 pb-10'>
                <InputForm placeholder='Имя ветки' type='text' />
                <div className='mt-10  w-full h-4/5 bg-zinc-50 rounded-lg overflow-scroll'>
                    {branches}
                </div>
            </div>
        </PopUp>
    )
}

export default BranchPopUp