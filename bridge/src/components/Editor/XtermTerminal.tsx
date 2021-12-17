import { useEffect } from 'react';
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
    const term = new Terminal()
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
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
        fitAddon.fit()
    }, [])

    useEffect(() => {
        fitAddon.fit()
        if (activePath !== null) {
            window.terminal.keystoke(`cd ${activePath.path}`)
            window.terminal.keystoke('\r')
        }
    }, [activePath])
    return (
        <div id='terminal'>

        </div>
    )
}

export default XtermTerminal