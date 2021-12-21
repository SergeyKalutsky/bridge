interface Props {
    children: React.ReactNode
}

const SideMenuHeader = ({ children }: Props): JSX.Element => {
    return (
        <div className='flex items-center justify-center w-full h-15 bg-sky-900 drop-shadow-lg'>
            {children}
        </div>
    )
}

export default SideMenuHeader