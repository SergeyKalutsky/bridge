interface Props {
    children?: React.ReactNode
    width?: number
    height?: number
    active?: boolean
    onClick?: () => void
}

const IconButton = ({ children, onClick, width, height, active }: Props): JSX.Element => {
    const bg = active ? 'bg-slate-500' : null
    return (
        <button className={`hover:bg-slate-500 ${bg} rounded-full w-${width} h-${height} flex items-center justify-center`}
            onClick={onClick}
        >{children}
        </button>
    )
}

export default IconButton