import { useState, useRef, useCallback } from 'react'
import React from 'react'

interface Props {
    children: React.ReactNode
}


const SideMenu = ({ children }: Props): JSX.Element => {
    const [size, setSize] = useState(300);
    const ref = useRef<HTMLButtonElement>();
    const handler = useCallback(() => {
        function onMouseMove(e) {
            console.log(e.pageX, e.pageY)
            if (!(e.pageX <= 350) && !(e.pageX >= 600)) {
                setSize(e.pageX - 80)
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
            <div className={`h-full bg-zinc-800 drop-shadow-lg`}
                style={{ width: size }}>
                {children}
            </div>
            <button className='w-1 h-full cursor-col-resize' ref={ref} onMouseDown={handler} />
        </>
    )
}

export default SideMenu