import { Button } from '../common';
import { CMD } from './Constants';
import { ActivePath } from './types';
import { Arrow, Refresh } from '../common/Icons';


interface Props {
    activePath: ActivePath
}


const ToolBar = ({ activePath }: Props) => {
    return (
        <div className="tool-bar">
            <Button onClick={() => { window.git.pull() }} btnText='pull'>
                <Arrow />
            </Button>
            <Button onClick={() => { window.git.push() }} btnText='commit'>
                <Arrow />
            </Button>
            <Button >
                <Refresh />
            </Button>
            <Button onClick={() => {
                if (!activePath.isDirectory) {
                    const ext = activePath.path.split(".")[1]
                    const excecutable = CMD[ext]
                    if (excecutable !== undefined) {
                        window.terminal.keystoke(`${excecutable} ${activePath.path}`)
                        window.terminal.keystoke('\r')
                    }
                }
            }}>
                RUN
            </Button>
        </div>

    )
}
export default ToolBar