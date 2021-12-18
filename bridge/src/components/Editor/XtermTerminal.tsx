import { useEffect, useLayoutEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit';


interface ActivePath {
    path: string
    isDirectory: boolean
}

interface Props {
    activePath: ActivePath
}

const XtermTerminal = ({ activePath }: Props): JSX.Element => {
    const term = new Terminal({
        fontSize: 20,
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
        term.open(document.getElementById('terminal'));
        term.write('Добро пожалаловать, нажмите Enter$ ')
        fitAddon.fit()
    }, [])

    useLayoutEffect(() => {
        function updateSize() {
            fitAddon.fit()
        }
        window.addEventListener('resize',  updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div id='terminal'>

        </div>
    )
}

export default XtermTerminal