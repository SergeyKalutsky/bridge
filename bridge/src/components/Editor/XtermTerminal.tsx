import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from 'xterm';
import { ActivePath } from './types';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'

interface Props {
    activePath: ActivePath
    activeToggle: boolean
}

const XtermTerminal = ({ activePath, activeToggle }: Props): JSX.Element => {
    const [size, setSize] = useState(1000);
    const ref = useRef<HTMLDivElement>();
   
    const handler = useCallback(() => {
        function onMouseMove(e) {
            setSize(size => size - e.movementX)
            fitAddon.fit()
        }
        function onMouseUp() {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        };
    }, [])

    useEffect(() => {
        if (!activeToggle) {
            return
        }
        handler()
    }, [activeToggle])

    const term = new Terminal({
        fontSize: 16,
    })
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon)
    term.onData(e => {
        window.terminal.keystoke(e)
    })
    window.terminal.incomingData("terminal:incomingdata", (data) => {
        term.write(data);
    });

    useEffect(() => {
        term.open(ref.current);
        term.write('Добро пожаловать, нажмите Enter$ ')
        fitAddon.fit()
    }, [])

    return (
        <>
            <div id='terminal' className='h-[34%] w-full flex flex-row' ref={ref} style={{width: size}}>
            </div>
        </>
    )
}

export default XtermTerminal