interface Props {
    children: React.ReactNode
}

const SideMenuHeader = ({ children }: Props): JSX.Element => {
    return (
        <div className='flex items-center justify-center grow h-[40px] bg-zinc-700 drop-shadow-lg'>
                {children}
        </div>
    )
}

export default SideMenuHeader