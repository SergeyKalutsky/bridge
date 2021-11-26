import Popup from 'reactjs-popup';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


interface CurrentMembersProp {
    members: Member[]
    project_id: number
}

const ProjectCurrentMembers = ({ members, project_id }: CurrentMembersProp): JSX.Element => {

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
                            const settings = JSON.parse(window.sessionStorage.getItem('settings'))
                            fetch('http://localhost:8000/members/delete',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-api-key': settings['user']['X-API-Key'],
                                    },
                                    body: JSON.stringify({ project_id: project_id, user_id: member.id })
                                })
                                .then(response => response.json())
                                .then(data => console.log(data));
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

export default ProjectCurrentMembers