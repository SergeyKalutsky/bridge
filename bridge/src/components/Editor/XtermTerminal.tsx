import { useEffect, useLayoutEffect } from 'react';
import { Terminal } from 'xterm';
import { ActivePath } from './types';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'

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
        console.log('here')
        // function updateSize() {
        //     fitAddon.fit()
        //     window.removeEventListener('resize', updateSize);
        // }
        // window.addEventListener('resize',  updateSize);
    });

    return (
        <div id='terminal' className='h-1/3 grow'>

        </div>
    )
}

export default XtermTerminal