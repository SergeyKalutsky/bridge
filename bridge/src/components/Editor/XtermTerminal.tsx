import { useEffect } from 'react';
import { Terminal } from 'xterm';

const XtermTerminal = (): JSX.Element => {
    const term = new Terminal
    useEffect(() => {
        term.open(document.getElementById('terminal'));
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    })
    return (
        <div className='terminal' id='terminal'>

        </div>
    )
}

export default XtermTerminal