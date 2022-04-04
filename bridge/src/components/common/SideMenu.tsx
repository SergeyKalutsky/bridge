import { useState, useRef, useEffect } from 'react'
import React from 'react'

interface Props {
    children: React.ReactNode
    activeToggle: boolean
    terminal?: boolean
}


const SideMenu = ({ children, activeToggle, terminal }: Props): JSX.Element => {
    const [size, setSize] = useState(350);
    const ref = useRef<HTMLDivElement>();
    useEffect(() => {
        if (!activeToggle) {
            return
        }
        function onMouseMove(e) {

            if ((!(ref.current.clientWidth <= 200) && (e.movementX < 0)) ||
                ((!(ref.current.clientWidth >= 500) && (e.movementX > 0)))) {
                setSize(size => size + e.movementX)
                if (terminal) {
                    window.terminal.fit({x: e.movementX})
                }
            }
        }
        function onMouseUp() {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }, [activeToggle])

    return (
        <>
            <div className={`h-full bg-zinc-800 drop-shadow-lg w-[350px]`}
                style={{ width: size }} ref={ref}>
                {children}
            </div>
        </>
    )
}

export default SideMenu