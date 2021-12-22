interface Props {
    children: React.ReactNode
}

const Workspace = ({ children }: Props): JSX.Element => {
    return (
        <div className='h-full border-l-1 grow bg-neutral-900'>
            {children}
        </div>
    )
}

export default Workspace