import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'



const getDXtermWidth = (): number => {
    const sideWidth = JSON.parse(window.localStorage.getItem('sideWidth'))
    return window.innerWidth - sideWidth - 80
  }

const Xterm = (): JSX.Element => {
    const term = new Terminal({
        fontSize: 16,
        cursorBlink: true
    })
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon)
    const ref = useRef<HTMLDivElement>();
    const [height, setHeight] = useState(200)
    const [width, setWidth] = useState(getDXtermWidth())

    const handleToggle = () => {
        function onMouseMove(e) {
            if ((!(ref.current.clientHeight <= 100) && (e.movementY > 0)) ||
                ((!(ref.current.clientHeight >= 500) && (e.movementY < 0)))) {
                window.terminal.fit({ y: e.movementY })
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
            setWidth(target.innerWidth - JSON.parse(window.localStorage.getItem('sideWidth')) - 80)
            fitAddon.fit()
        }
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, []);


    useEffect(() => {
        const unSub = () => {
            window.shared.removeListeners('terminal:incomingdata')
            window.shared.removeListeners('terminal:fit')
        }
        term.onData(e => {
            window.terminal.keystoke(e)
        })
        window.shared.incomingData("terminal:incomingdata", (data: string) => {
            term.write(data);
            window.sessionStorage.setItem('terminalOutput', window.sessionStorage.getItem('terminalOutput') + data)
        });
        window.shared.incomingData("terminal:fit", (data) => {
            if (data.y !== undefined) {
                setHeight(ref.current.clientHeight - data.y)
                // stupid hack because textarea doesn't resize properly
                if (data.y > 0) {
                    const element = document.querySelector('.xterm-helper-textarea')
                    let num = Number(element['style'].top.replace('px', ''))
                    num = num - data.y
                    element['style'].top = `${num}px`
                }

            }
            if (data.x !== undefined) {
                setWidth(ref.current.clientWidth - data.x)
            }
            fitAddon.fit()
        });
        term.open(ref.current);
        const output = window.sessionStorage.getItem('terminalOutput')
        if (output === null) {
            term.write('Добро пожаловать, нажмите Enter$ ')
        } else {
            term.write(output)
        }
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