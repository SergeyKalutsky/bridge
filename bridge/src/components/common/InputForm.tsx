interface Props {
    children?: React.ReactNode
    placeholder: string
    type: string
    value?: string
    classInput?: string,
    classDiv?: string,
    handleKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputForm({ children,
    placeholder,
    type,
    value,
    classInput = '',
    classDiv = '',
    handleKeyPress,
    onChange }: Props): JSX.Element {
    const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (value === undefined)
            return
        event.target.value = value
        event.target.setSelectionRange(0, event.target.value.lastIndexOf('.'))
    }
    const defaultClassInput = 'bg-zinc-300 pl-3 pr-3 pt-2 pb-2 text-xl w-full text-slate-700 placeholder-slate-500 border border-neutral-400 rounded-lg focus:outline-none '
    const defaultClassDiv = 'flex items-center justify-start bg-white w-full rounded-lg focus:outline-none bg-zinc-300 '
    return (
        <div className={defaultClassDiv + classDiv}>
            {children}
            <input className={defaultClassInput + classInput}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyPress} />
        </div>
    )
}
