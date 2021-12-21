import { useState, useRef, useCallback, useEffect } from 'react'

interface Props {
    children: React.ReactNode
}

const SideMenu = ({ children }: Props): JSX.Element => {
    const [width, setWidth] = useState(300);
    const ref = useRef<HTMLButtonElement>();

    const handler = useCallback(() => {
        function onMouseMove(e) {
            setWidth(400);
            console.log(width)
        }
        function onMouseUp() {
            ref.current.removeEventListener("mousemove", onMouseMove);
            ref.current.addEventListener("mouseup", onMouseUp);
        }
        ref.current.addEventListener("mousemove", onMouseMove);
        ref.current.addEventListener("mouseup", onMouseUp);
    }, []);
    return (
        <>
            <div className={`w-1/4 h-full bg-zinc-800 drop-shadow-lg`}
                style={{ width: width }}>
                {children}
            </div>
            <button className='w-10 h-full cursor-col-resize' ref={ref} onMouseDown={handler} />
        </>
    )
}

export default SideMenu