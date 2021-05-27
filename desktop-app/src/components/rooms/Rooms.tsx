import '../../assets/css/Rooms.css'
import RoomsMenu from './RoomsMenu'


const Rooms = (): JSX.Element => {
    return (
        <>
        <RoomsMenu />
        <div className='workspace'>
            <div className='workspace-background'>
            </div>
        </div>
        </>
    )
}


export default Rooms