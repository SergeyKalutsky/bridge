import Popup from 'reactjs-popup';
import { useState, useContext } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SettingsContext } from '../../../App'
import { deleteMember } from '../../../lib/api/index'
import { Member } from './ProjectMembers'


interface Props {
    member: Member
    project_id: number
    removeMember: (member: Member) => void
}

const CurrentMemberRow = ({ member,
    project_id,
    removeMember }: Props): JSX.Element => {

    const [open, setOpen] = useState(false)
    const { settings, setSettings } = useContext(SettingsContext)
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
                        deleteMember(settings, project_id, member.id)
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