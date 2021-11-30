import { useContext } from 'react';
import { SettingsContext } from '../../../App'
import CurrentMemberRow from './CurrentMemberRow'


interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


interface CurrentMembersProp {
    members: Member[]
    project_id: number
    removeMember: (member: Member) => void
}



const CurrentMembers = ({ members, project_id, removeMember }: CurrentMembersProp): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const deleteMember = (project_id: number, user_id: number) => {
        fetch('http://localhost:8000/members/delete',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': settings['user']['X-API-Key'],
                },
                body: JSON.stringify({ project_id: project_id, user_id: user_id })
            })
    }

    const membersArray = members.map((member, indx) =>
        <CurrentMemberRow member={member}
            deleteMember={deleteMember}
            removeMember={removeMember}
            key={indx}
            project_id={project_id} />
    )
    return (
        <div className='current-members'>
            {membersArray}
        </div>
    )
}

export default CurrentMembers