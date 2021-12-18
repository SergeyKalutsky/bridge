import { Button } from '@material-ui/core';
import { Arrow, Refresh } from '../Icons';

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
            <Button className="BttnP" color="primary"
                onClick={() => {
                    window.git.pull()
                }}>
                <span>pull</span>
                <Arrow />
            </Button>
            <Button className="BttnP" color="secondary"
                onClick={() => {
                    window.git.push()
                }}>
                <span>commit</span>
                <div className="ArrUp">
                    <Arrow />
                </div>
            </Button>
            <Button className='auto-update'>
                <Refresh />
            </Button>
            <Button className="BttnP run" color="secondary"
                onClick={() => {
                    if (!activePath.isDirectory){
                        const ext = activePath.path.split(".")[1]
                        const excecutable = CMDS[ext]
                        if (excecutable !== undefined){
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