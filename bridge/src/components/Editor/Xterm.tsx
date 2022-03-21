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
    const [height, setHeight] = useState(200)

    const handleToggle = () => {
        function onMouseMove(e) {
            if ((!(ref.current.clientHeight <= 100) && (e.movementY > 0)) ||
            ((!(ref.current.clientHeight >= 500) && (e.movementY < 0)))) {
                setHeight(height => height - e.movementY)
                fitAddon.fit()
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
        function updateSize() {
            fitAddon.fit()
        }
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, []);

    useEffect(() => {

        term.onData(e => {
            window.terminal.keystoke(e)
        })
        window.shared.incomingData("terminal:incomingdata", (data) => {
            term.write(data);
        });
        term.open(ref.current);
        term.write('Добро пожаловать, нажмите Enter$ ')
        fitAddon.fit()
    }, [])

    return (
        <>
            <button className='hover:h-[4px] h-[2px] hover:bg-cyan-700 bg-neutral-500 hover:cursor-row-resize w-full drop-shadow-lg'
                onMouseDown={handleToggle} />
            <div id='terminal' className='flex flex-row' ref={ref} style={{ height: height }}>
            </div>
        </>
    )
}

export default Xterm