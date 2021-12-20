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
            open={open}
            onClose={onClose}
            closeOnDocumentClick
            position="right center"
            modal>
            <div className="modal">
                {children}
            </div>
        </Popup>
    )
}

export default PopUp