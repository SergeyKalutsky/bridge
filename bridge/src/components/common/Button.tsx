interface Props {
    children?: React.ReactNode
    btnText: string
    onClick?: () => void
    disabled?: boolean
}

const Button = ({ children, btnText, onClick, disabled }: Props): JSX.Element => {
    const disabledStyle = disabled ? 'cursor-not-allowed bg-slate-800': 'hover:bg-sky-400'
    return (
        <button disabled={disabled}
            className={`w-32 h-10 bg-sky-800 ${disabledStyle} rounded-md text-gray-200 font-medium text-xl focus:outline-none`}
            onClick={onClick}
        >{btnText}{children}</button>

    )
}

export default Button