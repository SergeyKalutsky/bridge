import { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import { Member } from './ProjectMembers'
import { findUser } from '../../../lib/api/index'
import { addProjectMember } from '../../../lib/api/index'


interface Props {
    search: string
    open: boolean
    membersCurrent: Member[]
    project_id: number
    addMember: (member: Member) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const FindMembersPopUp = ({ membersCurrent,
    search,
    project_id,
    addMember,
    open, setOpen }: Props): JSX.Element => {
    const [memberFound, setmemberFound] = useState<Member>(null)

    const setMemberCurrent = (member: Member) => {
        if (member === null) { return member}
        for (const memberCurrent of membersCurrent) {
            if (memberCurrent.id === member.id) {
                member.iscurrent = true
                return member
            }
        }
        member.iscurrent = false
        return member
    }

    useEffect(() => {
        findUser(window.settings.get(), search)
            .then(data => setmemberFound(setMemberCurrent(data)))
    }, [search, membersCurrent])

    return (
        <Popup
            open={open}
            onClose={() => setOpen(false)}
            closeOnDocumentClick
            position="right center"
            modal>
            <div className="modal">
                <div className='search'>
                    {memberFound !== null ?
                        <div className='user-found'>
                            <span>{memberFound.name}</span>
                            <button disabled={memberFound.iscurrent == false ? false : true}
                                onClick={() => {
                                    addProjectMember(window.settings.get(), memberFound.id, project_id)
                                    addMember(memberFound)
                                }}>Пригласить</button>
                        </div> :
                        <div className='not-found'>
                            <span>К сожалению с таким ником никто не найден</span>
                            < button className="close" onClick={() => {
                                setOpen(false)
                            }}>
                                ОК
                            </button>
                        </div>}
                </div>
            </div>
        </Popup >
    )
}

export default FindMembersPopUp