import { useContext, useState } from 'react'
import { SettingsContext } from '../../../App'
import {Member} from './ProjectMembers'

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
                fetch('http://localhost:8000/members/add',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': settings['user']['X-API-Key']
                        },
                        body: JSON.stringify({
                            user_id: member.id,
                            project_id: project_id
                        })
                    })
                setlocalMember({...localMember, iscurrent: true})
                addMember(member)
            }}>Пригласить</button>
        </div>
    )
}

export default MembersList