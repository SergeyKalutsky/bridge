import { Button } from '@material-ui/core';
import { Arrow, Refresh } from '../Icons';

const ToolBar = () => {
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
        </div>

    )
}
export default ToolBar