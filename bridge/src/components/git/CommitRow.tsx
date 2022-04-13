type Props = {
    hash: string
    active: boolean
    onClickCallback: (hash: string) => void
}


const CommitRow = ({ hash, active, onClickCallback }: Props): JSX.Element => {
    const hashActive = active ? 'border-l-4 border-zinc-50' : ''
    return (
        <div className={`${hashActive} hover:bg-slate-700 hover:cursor-pointer text-xl flex items-center justify-center py-2 h-[40px] w-full`}
            onClick={() => onClickCallback(hash)}
        >
            <span className='text-white mr-[20px]'>commit</span>
            <span className='text-sky-600	'>{hash.substring(0, 8)}</span>
        </div>
    )
}

export default CommitRow