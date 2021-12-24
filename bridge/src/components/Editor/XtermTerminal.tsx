import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'

interface Props {
    activeToggle: boolean
}

const term = new Terminal({
    fontSize: 16,
})
const fitAddon = new FitAddon();
term.loadAddon(fitAddon)

const XtermTerminal = ({ activeToggle }: Props): JSX.Element => {
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (!activeToggle) {
            return
        }
        function onMouseMove(e) {
            fitAddon.fit()
        }
        function onMouseUp() {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }, [activeToggle])


    useEffect(() => {
        term.onData(e => {
            window.terminal.keystoke(e)
        })
        window.terminal.incomingData("terminal:incomingdata", (data) => {
            term.write(data);
        });
        term.open(ref.current);
        term.write('Добро пожаловать, нажмите Enter$ ')
        fitAddon.fit()
    }, [])

    return (
        <>
            <div id='terminal' className='h-[34%] w-full flex flex-row' ref={ref}>
            </div>
        </>
    )
}

export default XtermTerminal