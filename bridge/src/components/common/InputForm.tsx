interface Props {
    children?: React.ReactNode
    placeholder: string
    type: string
    value?: string
    className?: string,
    handleKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputForm({ children,
    placeholder,
    type,
    value,
    className = '',
    handleKeyPress,
    onChange }: Props): JSX.Element {
        const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (value === undefined)
            return
            event.target.value = value
            event.target.setSelectionRange(0, event.target.value.lastIndexOf('.'))
        }
    const defaultClass = 'bg-zinc-300 pl-3 pr-3 pt-2 pb-2 text-xl w-full text-slate-700 placeholder-slate-500 border border-neutral-400 rounded-lg focus:outline-none'
    return (
        <div className='flex items-center justify-start bg-white w-full rounded-lg focus:outline-none'>
            {children}
            <input className={defaultClass + className}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyPress} />
        </div>
    )
}
