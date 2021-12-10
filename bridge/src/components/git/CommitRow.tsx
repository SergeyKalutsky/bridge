type Props = {
    hash: string
    active: boolean
    onClickCallback: (hash: string) => void
}


const CommitRow = ({ hash, active, onClickCallback }: Props): JSX.Element => {
    return (
        <div className={active ? 'git-hash active' : 'git-hash'}
            onClick={() => onClickCallback(hash)}
        >
            <span className='commit'>commit</span>
            <span className='hash'>{hash.substr(0, 8)}</span>
        </div>
    )
}

export default CommitRow