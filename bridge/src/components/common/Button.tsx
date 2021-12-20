interface Props {
    children?: React.ReactNode
    btnText: string
    onClick?: () => void
}

const Button = ({ children, btnText, onClick }: Props): JSX.Element => {
    return (
        <button className="w-32 h-10 bg-sky-800 hover:bg-sky-400 rounded-md text-gray-200 font-medium text-xl focus:outline-none"
            onClick={onClick}
        >{btnText}{children}</button>

    )
}

export default Button