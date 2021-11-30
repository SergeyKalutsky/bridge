import Popup from 'reactjs-popup';
import { useState } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}

interface CurrentMemberRowProps {
    member: Member
    project_id: number
    removeMember: (member: Member) => void
    deleteMember: (project_id: number, user_id: number) => void
}

const CurrentMemberRow = ({ member,
    project_id,
    removeMember,
    deleteMember }: CurrentMemberRowProps): JSX.Element => {

    const [open, setOpen] = useState(false)
    return (
        <div className='current-member' key={member.id}>
            <div className='member'>
                {member.name}
            </div>
            <div className='icon' onClick={() => { setOpen(true) }}>
                <FontAwesomeIcon icon={faTrashAlt} />
            </div>
            <Popup
                open={open}
                onClose={() => setOpen(false)}
                closeOnDocumentClick
                modal
            >
                <div className="modal">
                    <div>Вы уверены, что хотите удалить участника(у него больше не будет доступа к проекту)?</div>
                    <button className="close" onClick={() => {
                        deleteMember(project_id, member.id)
                        removeMember(member)
                        setOpen(false)
                    }}>
                        Удалить
                    </button>
                </div>
            </Popup >
        </div>
    )
}

export default CurrentMemberRow