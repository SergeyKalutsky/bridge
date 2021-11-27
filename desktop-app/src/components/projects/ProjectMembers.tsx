import { useContext, useEffect, useState } from 'react'
import '../../assets/css/ProjectMembers.css'
import FoundMemberList from './FoundMemberList'
import ProjectCurrentMembers from './ProjectCurrentMembers'
import { SettingsContext } from '../../App'

type Props = {
    project_id: number
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


const ProjectMembers = ({ project_id }: Props): JSX.Element => {
    const {settings, setSettings} = useContext(SettingsContext)
    const [forceUpdate, setForceUpdate] = useState(true)
    const [membersFind, setMembersFind] = useState<Member[]>([])
    const [membersCurrent, setMembersCureent] = useState<Member[]>([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetch(`http://localhost:8000/members/list?project_id=${project_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': settings['user']['X-API-Key']
                }
            })
            .then(response => response.json())
            .then(data => setMembersCureent(data))
    }, [forceUpdate])

    const membersArray = membersFind.map((member) =>
        <FoundMemberList member={member}
            project_id={project_id}
            key={member.id}
            forceUpdate={forceUpdate}
            setForceUpdate={setForceUpdate} />
    )
    return (
        <div className='menu'>
            <div className='search'>
                <input type="text"
                    placeholder='Введите имя пользователя'
                    onChange={(e) => { setSearch(e.target.value) }} />
                <button onClick={() => {
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
            <ProjectCurrentMembers members={membersCurrent}
                project_id={project_id}
                setForceUpdate={setForceUpdate}
                forceUpdate={forceUpdate} />
        </div>
    )
}


export default ProjectMembers