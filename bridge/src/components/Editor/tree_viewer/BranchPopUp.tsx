import { useEffect, useState } from 'react'
import { PopUp, InputForm } from '../../common'


function BranchRow({ branch }: {
    branch: string;
}): JSX.Element {
    return (<div
        className={`pl-5 hover: cursor-pointer hover:bg-sky-400/20 text-slate-800 text-xl flex items-center w-full h-[40px]`}>
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
                null : <BranchRow branch={branch} key={branch} />))
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