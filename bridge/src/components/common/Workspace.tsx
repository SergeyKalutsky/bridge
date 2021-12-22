interface Props {
    children: React.ReactNode
}

const Workspace = ({ children }: Props): JSX.Element => {
    return (
        <div className='h-full border-l-1 grow'>
            <div className='flex flex-col justify-center h-full w-full bg-neutral-900'>
                {children}
            </div>
        </div>
    )
}

export default Workspace