import { useState, useRef, useEffect } from 'react'
import React from 'react'

interface Props {
    children: React.ReactNode
    activeToggle: boolean
}

const setSideMenuStartWidth = () => {
    const sideMenuWidth = JSON.parse(window.localStorage.getItem('sideWidth'))
    if (sideMenuWidth === null) {
        window.localStorage.setItem('sideWidth', JSON.stringify(350))
        return 350
}
    return sideMenuWidth
}

const SideMenu = ({ children, activeToggle }: Props): JSX.Element => {
    const [size, setSize] = useState(setSideMenuStartWidth());
    const ref = useRef<HTMLDivElement>();
    useEffect(() => {
        
        if (!activeToggle) {
            return
        }
        function onMouseMove(e) {

            if ((!(ref.current.clientWidth <= 200) && (e.movementX < 0)) ||
                ((!(ref.current.clientWidth >= 500) && (e.movementX > 0)))) {
                setSize(size => size + e.movementX)
                window.localStorage.setItem('sideWidth', JSON.stringify(ref.current.clientWidth))
                window.terminal.fit({ x: e.movementX })
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