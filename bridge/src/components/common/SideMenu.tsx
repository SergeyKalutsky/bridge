import { useState, useRef, useCallback } from 'react'
import React from 'react'

interface Props {
    children: React.ReactNode
}


const SideMenu = ({ children }: Props): JSX.Element => {
    const [size, setSize] = useState(350);
    const ref = useRef<HTMLDivElement>();
    const handler = useCallback(() => {
        function onMouseMove(e) {
            if ((!(ref.current.clientWidth <= 200) && (e.movementX < 0)) ||
                ((!(ref.current.clientWidth >= 500) && (e.movementX > 0)))) {
                setSize(size => size + e.movementX)
            }
        }
        function onMouseUp() {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }, []);

    return (
        <>
            <div className={`h-full bg-zinc-800 drop-shadow-lg w-[350px]`}
                style={{ width: size }} ref={ref}>
                {children}
            </div>
            <button className='hover:w-1 h-full hover:bg-cyan-700 bg-neutral-900 hover:cursor-col-resize w-[2px]'
                onMouseDown={handler} />
        </>
    )
}

export default SideMenu