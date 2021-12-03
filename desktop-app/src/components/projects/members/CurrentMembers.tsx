import { useContext } from 'react';
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