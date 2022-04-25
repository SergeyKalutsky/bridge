import { useState, useEffect } from 'react'

interface Props {
    children: React.ReactNode
}

const getWidth = (): number => {
    const sideWidth = JSON.parse(window.localStorage.getItem('sideWidth'))
    return window.innerWidth - sideWidth - 80
}

const Workspace = ({ children }: Props): JSX.Element => {
    const [width, setWidth] = useState(getWidth())
    useEffect(() => {
        window.shared.incomingData("terminal:fit", ({x, y}) => {
            if (x !== undefined) {
                setWidth(width => width - x)
            }
        });
        return () => window.shared.removeListeners("terminal:fit")
    }, [])

    useEffect(() => {
        function updateSize({ target }) {
            setWidth(target.innerWidth - JSON.parse(window.localStorage.getItem('sideWidth')) - 80)
        }
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, []);
    return (
        <div style={{ width: width }} className='h-full border-l-1 grow bg-neutral-900 flex flex-col'>
            {children}
        </div>
    )
}

export default Workspace