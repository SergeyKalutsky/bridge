import  Button  from '../common/Button';
import { Arrow, Refresh } from '../common/Icons';

interface ActivePath {
    path: string
    isDirectory: boolean
}

interface Props {
    activePath: ActivePath
}


const CMDS = {
    js: 'node',
    ts: 'ts-node',
    py: 'python'
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
                        const excecutable = CMDS[ext]
                        if (excecutable !== undefined) {
                            window.terminal.keystoke(`${excecutable} ${activePath.path}`)
                            window.terminal.keystoke('\r')
                        }
                    }
                }}>
                <span>RUN</span>
            </Button>
        </div>

    )
}
export default ToolBar