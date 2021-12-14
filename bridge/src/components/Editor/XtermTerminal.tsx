import { useEffect } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const XtermTerminal = (): JSX.Element => {
    const term = new Terminal()
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon)

    useEffect(() => {
        term.open(document.getElementById('terminal'));
        fitAddon.fit()
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    })
    return (
        <div id='terminal'>

        </div>
    )
}

export default XtermTerminal