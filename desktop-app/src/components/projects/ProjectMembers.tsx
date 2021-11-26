import { useState } from 'react'
import '../../assets/css/ProjectMembers.css'

type Props = {
    project_id: number
}

interface Member {
    id: number
    name: string
}

type FoundMemberListProps = {
    member: Member
    project_id: number
}

const FoundMemberList = ({ member, project_id }: FoundMemberListProps): JSX.Element => {

    return (
        <div className='project-found'>
            {member.name}
            <button onClick={() => {
                const settings = JSON.parse(window.sessionStorage.getItem('settings'))
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
                    .then(response => response.json())
                    .then(data => console.log(data))
            }}>Присоединится</button>
        </div>
    )
}

const ProjectMembers = ({ project_id }: Props): JSX.Element => {
    const [members, setMembers] = useState<Member[]>([])
    const [search, setSearch] = useState('')
    console.log(members)
    const membersArray = members.map((member) =>
        <FoundMemberList member={member} project_id={project_id} key={member.id}/>
    )
    console.log(membersArray)
    return (
        <div className='menu'>
            <div className='search'>
                <input type="text"
                    placeholder='Введите имя пользователя'
                    onChange={(e) => { setSearch(e.target.value) }} />
                <button onClick={() => {
                    const settings = JSON.parse(window.sessionStorage.getItem('settings'))
                    fetch(`http://localhost:8000/users/find`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': settings['user']['X-API-Key']
                            },
                            body: JSON.stringify({ name: search })
                        })
                        .then(response => response.json())
                        .then(data => setMembers(data))
                }}> Поиск</button>
            </div>
            {membersArray}
        </div>
    )
}


export default ProjectMembers