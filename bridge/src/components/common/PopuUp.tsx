import Popup from 'reactjs-popup';

interface Props {
    children?: React.ReactNode
    open: boolean
    onClose: () => void
    key?: string | number
}

const PopUp = ({ open, children, onClose }: Props): JSX.Element => {
    return (
        <Popup
            contentStyle={{backgroundColor: 'transparent',
            width: '40%'}}
            open={open}
            onClose={onClose}
            closeOnDocumentClick
            position="right center"
            modal>
            <div className="p-3 gap-y-2 h-fit flex flex-col justify-center items-center bg-slate-300 rounded-md opacity-80 text-slate-900 text-2xl text-bold">
                {children}
            </div>
        </Popup>
    )
}

export default PopUp