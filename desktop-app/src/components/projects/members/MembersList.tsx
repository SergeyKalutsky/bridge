import { useContext, useState } from 'react'
import { SettingsContext } from '../../../App'
import { Member } from './ProjectMembers'
import { addProjectMember } from '../../../lib/api/index'


type Props = {
    member: Member
    project_id: number
    addMember: (member: Member) => void
}

const MembersList = ({ member,
    project_id,
    addMember }: Props): JSX.Element => {
    const [localMember, setlocalMember] = useState<Member>(member)
    const { settings, setSettings } = useContext(SettingsContext)
    return (
        <div className='project-found'>
            {localMember.name}
            <button disabled={localMember.iscurrent == false ? false : true} onClick={() => {
                addProjectMember(settings, member.id, project_id)
                setlocalMember({ ...localMember, iscurrent: true })
                addMember(member)
            }}>Пригласить</button>
        </div>
    )
}

export default MembersList