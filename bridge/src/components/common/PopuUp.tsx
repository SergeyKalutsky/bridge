import Popup from 'reactjs-popup';
import { PopupPosition } from 'reactjs-popup/dist/types';


function PopUp({ open, children, onClose, width = 40, height = 20, opacity=95, position='top center' }: {
    children?: React.ReactNode
    open: boolean
    onClose: () => void
    key?: string | number
    width?: number
    height?: number
    opacity?: number
    position?: PopupPosition
}): JSX.Element {
    return (
        <Popup
            contentStyle={{ width: `${width}%`, height: `${height}%` }}
            open={open}
            onClose={onClose}
            closeOnDocumentClick
            position={position}
            modal>
            <div className={`p-3 gap-y-2 h-fit flex flex-col justify-center items-center bg-slate-400 rounded-md opacity-${opacity} text-slate-900 text-2xl text-bold`}>
                {children}
            </div>
        </Popup>
    );
}

export default PopUp