import { useContext } from 'react'
import { SettingsContext } from '../../../App'

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}

type MemberListProps = {
    member: Member
    project_id: number
    setMembersCureent: React.Dispatch<React.SetStateAction<Member[]>>
}

const MembersList = ({ member,
    project_id,
    setMembersCureent }: MemberListProps): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    return (
        <div className='project-found'>
            {member.name}
            <button onClick={() => {
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
                fetch(`http://localhost:8000/members/list?project_id=${project_id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': settings['user']['X-API-Key']
                        }
                    })
                    .then(response => response.json())
                    .then(data => setMembersCureent(data))
            }}>Пригласить</button>
        </div>
    )
}

export default MembersList