import { BsPeopleFill } from 'react-icons/bs'

export function ProjectMembers(): JSX.Element {
    return (
        <>
            <div className="flex">
                <BsPeopleFill style={{ width: 30, height: 30, color: '#e2e8f0', marginLeft: 10 }} />
                <span className='ml-3 text-slate-200 font-semibold text-lg'>Project members</span>
            </div>
            <div className='w-full h-[200px] flex flex-col bg-zinc-400 rounded-lg'>
                {/* Члены проекта  */}
            </div>
        </>
    )
}