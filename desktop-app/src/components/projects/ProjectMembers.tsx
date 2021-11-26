import { useEffect, useState } from 'react'
import '../../assets/css/ProjectMembers.css'
import FoundMemberList from './FoundMemberList'
import ProjectCurrentMembers from './ProjectCurrentMembers'

type Props = {
    project_id: number
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}



const ProjectMembers = ({ project_id }: Props): JSX.Element => {
    const [membersFind, setMembersFind] = useState<Member[]>([])
    const [membersCurrent, setMembersCureent] = useState<Member[]>([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const settings = JSON.parse(window.sessionStorage.getItem('settings'))
        fetch(`http://localhost:8000/members/list?project_id=${project_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': settings['user']['X-API-Key']
                }
            })
            .then(response => response.json())
            .then(data => setMembersCureent(data))
    }, [])

    const membersArray = membersFind.map((member) =>
        <FoundMemberList member={member} project_id={project_id} key={member.id} />
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
                        .then(data => setMembersFind(data))
                }}> Поиск</button>
            </div>
            {membersArray}
            <ProjectCurrentMembers members={membersCurrent} project_id={project_id} />
        </div>
    )
}


export default ProjectMembers