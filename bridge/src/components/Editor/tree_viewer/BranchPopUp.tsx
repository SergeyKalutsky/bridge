import { useEffect, useState } from 'react'
import { PopUp, InputForm } from '../../common'
import { IoMdGitBranch } from 'react-icons/io'


function BranchRow({ branch, setOpen }: {
    branch: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
    function onClick() {
        window.git.checkoutBranch({ branch: branch });
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
        console.log(selectedBranch)
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