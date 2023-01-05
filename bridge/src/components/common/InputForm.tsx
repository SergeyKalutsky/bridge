interface Props {
    children?: React.ReactNode
    placeholder: string
    type: string
    value?: string
    handleKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputForm = ({ children,
    placeholder,
    type,
    value,
    handleKeyPress,
    onChange }: Props): JSX.Element => {
    const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (value === undefined) return
        event.target.value = value
        event.target.setSelectionRange(0, event.target.value.lastIndexOf('.'))
    }
    return (
        <div className='flex items-center justify-start bg-white w-full rounded-lg focus:outline-none'>
            {children}
            <input className='text-xl w-full rounded-lg ml-2 focus:outline-none'
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyPress} />
        </div>
    )
}

export default InputForm