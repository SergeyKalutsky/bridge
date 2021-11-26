import { useEffect, useState } from 'react'
import '../../assets/css/ProjectMembers.css'
import FoundMemberList from './FoundMemberList'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    project_id: number
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}

interface CurrentMembersProp {
    members: Member[]
}

const CurrentMembers = ({ members }: CurrentMembersProp): JSX.Element => {

    return (
        <div className='current-members'>
            <div className='current-member'>
                <div className='member'>
                    Nikita
                </div>
                <div className='icon'><FontAwesomeIcon icon={faTrashAlt} /></div>
            </div>
            <div className='current-member'>
                <div className='member'>
                    Sergey
                </div>
                <div className='icon'><FontAwesomeIcon icon={faTrashAlt} /></div>
            </div>
        </div>
    )
}


const ProjectMembers = ({ project_id }: Props): JSX.Element => {
    const [members, setMembers] = useState<Member[]>([])
    const [search, setSearch] = useState('')

    useEffect(()=>{
        const settings = JSON.parse(window.sessionStorage.getItem('settings'))
        fetch(`http://localhost:8000/members/get`,
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
    }, [])

    const membersArray = members.map((member) =>
        <FoundMemberList member={member} project_id={project_id} key={member.id} />
    )
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
            <CurrentMembers />
        </div>
    )
}


export default ProjectMembers