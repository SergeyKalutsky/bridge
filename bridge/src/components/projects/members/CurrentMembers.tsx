import CurrentMemberRow from './CurrentMemberRow'
import { Member } from '../types'

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
        <div className='w-4/5 h-4/5 flex flex-col text-white items-center bg-zinc-400 rounded-lg drop-shadow-lg'>
            {membersArray}
        </div>
    )
}

export default CurrentMembers