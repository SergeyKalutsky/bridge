interface Props {
    handleToggle: () => void
}

const ToggleBar = ({ handleToggle }: Props): JSX.Element => {

    return (
        <button className='hover:w-1 h-full hover:bg-cyan-700 bg-neutral-900 hover:cursor-col-resize w-[2px] drop-shadow-lg'
            onMouseDown={handleToggle} />
    )
}

export default ToggleBar
