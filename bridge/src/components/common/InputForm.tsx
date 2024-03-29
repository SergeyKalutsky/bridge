import { useEffect, useRef, useState } from "react"

interface Props {
    children?: React.ReactNode
    placeholder: string
    type: string
    value?: string
    classInput?: string,
    classDiv?: string,
    disabled?: boolean
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
    disabled = false,
    onChange = () => { return undefined } }: Props): JSX.Element {
    const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (value === undefined)
            return
        event.target.value = value
        event.target.setSelectionRange(0, event.target.value.lastIndexOf('.'))
    }
    const [bigText, setBigText] = useState(false)
    const ref = useRef(null)

    function handleChange(e) {
        onChange(e)
        if (type === 'password' && e.target.value != '') {
            setBigText(true)
            return
        }
        setBigText(false)
    }
    const defaultClassInput = 'bg-zinc-50 pl-3 pr-3 pt-2 pb-2 text-xl w-full text-slate-700 placeholder-slate-500 font-medium border border-neutral-400 rounded-lg focus:outline-none '
    const defaultClassDiv = 'flex items-center justify-start w-full rounded-lg focus:outline-none bg-zinc-50 '
    return (
        <div className={defaultClassDiv + classDiv + (bigText ? ' h-[52px]' : '')}>
            {children}
            <input ref={ref} className={defaultClassInput + classInput + (bigText ? ' text-4xl pt-0 pb-0 h-[52px]' : '')}
                disabled={disabled}
                type={type}
                placeholder={placeholder}
                onChange={handleChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyPress}
                value={value} />
        </div>
    )
}
