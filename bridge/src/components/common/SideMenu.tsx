interface Props {
    children: React.ReactNode
}

const SideMenu = ({ children }: Props): JSX.Element => {
    return (
        <div className='w-1/4 h-full bg-zinc-800 drop-shadow-lg'>
            {children}
        </div>
    )
}

export default SideMenu