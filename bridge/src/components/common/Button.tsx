const themes = {
    default: {
        base: 'rounded-md text-gray-200 bg-sky-800 font-medium',
        hover: 'hover:bg-sky-400'
    },
    purple: {
        base: 'rounded-md text-white bg-violet-500 font-medium',
        hover: 'hover:bg-violet-300'
    },
    teal: {
        base: 'rounded-md text-white bg-teal-500 font-medium',
        hover: 'hover:bg-teal-200'
    }
}

interface Props {
    children?: React.ReactNode
    btnText?: string
    onClick?: (e?) => void
    disabled?: boolean
    theme?: string
    w?: number
    h?: number
}

export default function Button({ children,
    btnText,
    onClick,
    disabled,
    theme,
    w = 40,
    h = 50 }: Props): JSX.Element {
    const style = theme === undefined ? themes['default'] : themes[theme]
    const disabledStyle = disabled ? 'cursor-not-allowed bg-slate-900' : style['hover']
    return (
        <button disabled={disabled}
            className={`${disabledStyle} ${style['base']} pl-2 pr-2 pb-2 pt-2 font-medium text-xl focus:outline-none flex flex-row justify-center items-center w-[${w}px] h-[${h}px] `}
            onClick={e => onClick(e)}
        >{btnText}{children}</button>

    )
}
