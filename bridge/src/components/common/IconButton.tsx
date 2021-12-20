interface Props {
    children?: React.ReactNode
    width?: number
    height?: number
    onClick?: () => void
}

const IconButton = ({ children, onClick, width, height }: Props): JSX.Element => {
    return (
        <button className={`hover:bg-slate-500 rounded-full w-${width} h-${height} flex items-center justify-center`}
            onClick={onClick}
        >{children}
        </button>
    )
}

export default IconButton