import { useEffect, useState } from 'react'
import PopUp from '../../common/PopuUp';
import Button from '../../common/Button';
import { Member } from '../types'
import { findUser } from '../../../lib/api/gitlab/index'
import { addProjectMember } from '../../../lib/api/gitlab/index'


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
        if (member === null) { return member }
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
        <PopUp
            open={open}
            onClose={() => setOpen(false)}>
            <div className='w-3/5 flex items-center justify-center'>
                {memberFound !== null ?
                    <div className='flex justify-center flex-col items-center text-xl'>
                        <span>{memberFound.name}</span>
                        <Button
                            disabled={memberFound.iscurrent == false ? false : true}
                            onClick={() => {
                                addProjectMember(window.settings.get(), memberFound.id, project_id)
                                addMember(memberFound)
                                setOpen(false)
                            }} btnText='Пригласить' />
                    </div> :
                    <div className='flex flex-col justify-center items-center'>
                        <span>К сожалению с таким ником никто не найден</span>
                        < Button onClick={() => { setOpen(false) }} btnText='OK' />
                    </div>}
            </div>
        </PopUp >
    )
}

export default FindMembersPopUp