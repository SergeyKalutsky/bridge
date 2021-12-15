import { useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit';

const XtermTerminal = (): JSX.Element => {
    const term = new Terminal()
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon)

    useEffect(() => {
        term.open(document.getElementById('terminal'));
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
        fitAddon.fit()
    }, [])
    return (
        <div id='terminal'>

        </div>
    )
}

export default XtermTerminal