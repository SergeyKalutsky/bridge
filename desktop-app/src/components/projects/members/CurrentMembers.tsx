import Popup from 'reactjs-popup';
import { useContext } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SettingsContext } from '../../../App'


interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


interface CurrentMembersProp {
    members: Member[]
    project_id: number
    setMembersCureent: React.Dispatch<React.SetStateAction<Member[]>>
}

const CurrentMembers = ({ members, project_id, setMembersCureent }: CurrentMembersProp): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const membersArray = members.map((member) =>
        <div className='current-member' key={member.id}>
            <div className='member'>
                {member.name}
            </div>
            <Popup
                trigger={<div className='icon'><FontAwesomeIcon icon={faTrashAlt} /></div>}
                position="right center"
                modal
            >
                {() => (
                    <div className="modal">
                        <div>Вы уверены, что хотите удалить участника?</div>
                        <button className="close" onClick={() => {
                            fetch('http://localhost:8000/members/delete',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-api-key': settings['user']['X-API-Key'],
                                    },
                                    body: JSON.stringify({ project_id: project_id, user_id: member.id })
                                })
                            fetch(`http://localhost:8000/members/list?project_id=${project_id}`,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-api-key': settings['user']['X-API-Key']
                                    }
                                })
                                .then(response => response.json())
                                .then(data => setMembersCureent(data))
                        }}>
                            Удалить
                        </button>
                        <button className="close" onClick={() => { close }}>
                            Закрыть
                        </button>
                    </div>
                )
                }
            </Popup >
        </div>
    )

    return (
        <div className='current-members'>
            {membersArray}
        </div>
    )
}

export default CurrentMembers