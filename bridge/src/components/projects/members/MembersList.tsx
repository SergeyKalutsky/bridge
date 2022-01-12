import { useState } from 'react'
import { Member } from '../types'
import { addProjectMember } from '../../../lib/api/gitlab/index'


type Props = {
    member: Member
    project_id: number
    addMember: (member: Member) => void
}

const MembersList = ({ member,
    project_id,
    addMember }: Props): JSX.Element => {
    const [localMember, setlocalMember] = useState<Member>(member)
    return (
        <div className='w-2/4 mt-5 flex flex-row text-2xl text-white items-center justify-center'>
            {localMember.name}
            <button disabled={localMember.iscurrent == false ? false : true} onClick={() => {
                addProjectMember(window.settings.get('user'), member.id, project_id)
                setlocalMember({ ...localMember, iscurrent: true })
                addMember(member)
            }}>Пригласить</button>
        </div>
    )
}

export default MembersList