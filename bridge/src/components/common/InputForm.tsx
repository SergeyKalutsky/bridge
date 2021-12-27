interface Props {
    children?: React.ReactNode
    placeholder: string
    type: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputForm = ({ children,
    placeholder,
    type,
    onChange }: Props): JSX.Element => {
    return (
        <div className='flex items-center justify-start bg-white w-full rounded-lg focus:outline-none mb-5'>
            {children}
            <input className='text-xl w-full rounded-lg ml-2 focus:outline-none'
                type={type}
                placeholder={placeholder}
                onChange={onChange} />
        </div>
    )
}

export default InputForm