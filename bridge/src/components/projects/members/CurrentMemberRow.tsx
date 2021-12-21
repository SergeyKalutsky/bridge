import Popup from 'reactjs-popup';
import { useState } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteMember } from '../../../lib/api/index'
import { Member } from '../types'


interface Props {
    member: Member
    project_id: number
    removeMember: (member: Member) => void
}

const CurrentMemberRow = ({ member,
    project_id,
    removeMember }: Props): JSX.Element => {

    const [open, setOpen] = useState(false)
    return (
        <div className='w-4/5 mt-5 mb-5 pt-2 pb-2 flex justify-center items-center cursor-pointer hover:bg-zinc-700 rounded-lg' key={member.id}>
            <div className='w-11/12 flex justify-between items-center flex-row text-2xl'>
                    {member.name}
                <div onClick={() => { setOpen(true) }}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </div>
                <Popup
                    open={open}
                    onClose={() => setOpen(false)}
                    closeOnDocumentClick
                    modal
                >
                    <div className="modal">
                        <div>Вы уверены, что хотите удалить участника?</div>
                        <button className="close" onClick={() => {
                            deleteMember(window.settings.get(), project_id, member.id)
                            removeMember(member)
                            setOpen(false)
                        }}>
                            Удалить
                        </button>
                    </div>
                </Popup >
            </div>
        </div>
    )
}

export default CurrentMemberRow