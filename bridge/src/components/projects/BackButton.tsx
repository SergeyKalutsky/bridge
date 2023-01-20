import { BsArrowLeft } from 'react-icons/bs';

export function BackButton({ onClick }: { onClick: () => void }): JSX.Element {
    return (
        <div className='flex justify-center items-center h-[70px]' onClick={onClick}>
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