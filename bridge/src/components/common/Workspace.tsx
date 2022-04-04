interface Props {
    children: React.ReactNode
}

const Workspace = ({ children }: Props): JSX.Element => {
    return (
        <div className='h-full w-[calc(100%-430px)] border-l-1 grow bg-neutral-900 flex flex-col'>
            {children}
        </div>
    )
}

export default Workspace