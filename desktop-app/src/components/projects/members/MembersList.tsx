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
    forceUpdate: boolean
    setForceUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const MembersList = ({ member,
    project_id,
    forceUpdate,
    setForceUpdate }: MemberListProps): JSX.Element => {
    const {settings, setSettings} = useContext(SettingsContext)
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
                setForceUpdate(forceUpdate == true ? false : true)
            }}>Пригласить</button>
        </div>
    )
}

export default MembersList