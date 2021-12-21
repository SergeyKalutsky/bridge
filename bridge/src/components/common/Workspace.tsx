interface Props {
    children: React.ReactNode
}

const Workspace = ({ children }: Props): JSX.Element => {
    return (
        <div className='w-3/4 h-full border-l-1'>
            <div className='flex flex-col justify-center h-full w-full bg-neutral-900'>
                {children}
            </div>
        </div>
    )
}

export default Workspace