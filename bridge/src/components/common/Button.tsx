interface Props {
    children?: React.ReactNode
    btnText?: string
    onClick?: () => void
    disabled?: boolean
    theme?: string
    width?: string
    height?: number
}

const themes = {
    default: {
        base: 'rounded-md text-gray-200 bg-sky-800 font-medium',
        hover: 'hover:bg-sky-400'
    },
    purple: {
        base: 'rounded-md text-white bg-violet-500 font-medium',
        hover: 'hover:bg-violet-300'
    }
}

const Button = ({ children,
    btnText,
    onClick,
    disabled,
    theme,
    width,
    height }: Props): JSX.Element => {
    console.log(width)
    const style = theme === undefined ? themes['default'] : themes[theme]
    const disabledStyle = disabled ? 'cursor-not-allowed bg-slate-800' : style['hover']
    const w = 'w-32'
    const h = `h-${height}`
    return (
        <button disabled={disabled}
            className={`${disabledStyle} ${style['base']} ${w} ${h} font-medium text-xl focus:outline-none flex flex-row justify-center items-center`}
            onClick={onClick}
        >{btnText}{children}</button>

    )
}


Button.defaultProps = {
    width: 32,
    height: 10
}

export default Button