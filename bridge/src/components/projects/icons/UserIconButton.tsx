import { faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type UserProps = {
    id: number
    dispatch: React.Dispatch<any>
}

const UserIconButton = ({ id, dispatch }: UserProps): JSX.Element => {

    return (
        <div className='icon'><FontAwesomeIcon icon={faUserEdit}
            onClick={() => { dispatch({ type: 'memberFind', payload: id }) }}
        /></div>
    )
}

export default UserIconButton