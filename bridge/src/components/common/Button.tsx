interface Props {
    children?: React.ReactNode
    btnText?: string
    onClick?: () => void
    disabled?: boolean
    theme?: string
}

const themes = {
    default: 'rounded-md text-gray-200 bg-sky-800 w-32 h-10 font-medium'
}

const Button = ({ children,
    btnText,
    onClick,
    disabled,
    theme }: Props): JSX.Element => {
    const disabledStyle = disabled ? 'cursor-not-allowed bg-slate-800' : 'hover:bg-sky-400'
    const style = theme === undefined ? themes['default'] : themes[theme]
    return (
        <button disabled={disabled}
            className={`${disabledStyle} ${style} font-medium text-xl focus:outline-none flex flex-row justify-center items-center`}
            onClick={onClick}
        >{btnText}{children}</button>

    )
}

export default Button