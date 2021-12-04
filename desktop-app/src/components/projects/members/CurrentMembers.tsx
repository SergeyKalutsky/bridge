import CurrentMemberRow from './CurrentMemberRow'
import { Member } from './ProjectMembers'

interface Props {
    members: Member[]
    project_id: number
    removeMember: (member: Member) => void
}

const CurrentMembers = ({ members, project_id, removeMember }: Props): JSX.Element => {

    const membersArray = members.map((member, indx) =>
        <CurrentMemberRow member={member}
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