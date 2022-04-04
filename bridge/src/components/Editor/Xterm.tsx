import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'

interface Props {
    activeToggle: boolean
}

const Xterm = ({ activeToggle }: Props): JSX.Element => {
    const term = new Terminal({
        fontSize: 16,
    })
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon)
    const ref = useRef<HTMLDivElement>();
    console.log(window.innerWidth)
    const [height, setHeight] = useState(200)
    const [width, setWidth] = useState(window.innerWidth - 430)

    const handleToggle = () => {
        function onMouseMove(e) {
            if ((!(ref.current.clientHeight <= 100) && (e.movementY > 0)) ||
                ((!(ref.current.clientHeight >= 500) && (e.movementY < 0)))) {
                console.log(e.movementY)
                setHeight(height => height - e.movementY)
                window.terminal.fit()
            }
        }
        function onMouseUp() {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }

    useEffect(() => {
        function updateSize({ target }) {
            setWidth(target.innerWidth - 430)
            fitAddon.fit()
        }
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, []);


    useEffect(() => {
        const unSub = ()=> {
            window.shared.removeListeners('terminal:incomingdata')
            window.shared.removeListeners('terminal:fit') 
        }
        term.onData(e => {
            window.terminal.keystoke(e)
        })
        window.shared.incomingData("terminal:incomingdata", (data) => {
            term.write(data);
        });
        window.shared.incomingData("terminal:fit", (data) => {
            console.log(data)
            fitAddon.fit()
        });
        term.open(ref.current);
        term.write('Добро пожаловать, нажмите Enter$ ')
        fitAddon.fit()
        
        return () => unSub()
    }, [])

    return (
        <>
            <button className='hover:h-[4px] h-[2px] hover:bg-cyan-700 bg-neutral-500 hover:cursor-row-resize w-full drop-shadow-lg'
                onMouseDown={handleToggle} />
            <div id='terminal' className='flex flex-row' ref={ref} style={{ height: height, width: width }}>
            </div>
        </>
    )
}

export default Xterm