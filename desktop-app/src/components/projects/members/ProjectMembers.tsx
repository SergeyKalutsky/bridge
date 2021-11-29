import { useContext, useEffect, useState } from 'react'
import '../../../assets/css/ProjectMembers.css'
import { SettingsContext } from '../../../App'
import CurrentMembers from './CurrentMembers'
import FindMembersPopUp from './FindMembersPopUp'

type Props = {
    project_id: number
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


const ProjectMembers = ({ project_id }: Props): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const [open, setOpen] = useState(false)
    const [membersFind, setMembersFind] = useState<Member[]>([])
    const [membersCurrent, setMembersCurrent] = useState<Member[]>([])
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
            .then(data => setMembersCurrent(data))
    }, [])
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
                    setOpen(true)
                }}> Поиск</button>
            </div>
            <FindMembersPopUp membersFind={membersFind}
                project_id={project_id}
                setMembersCurrent={setMembersCurrent}
                open={open}
                setOpen={setOpen} />
            <CurrentMembers members={membersCurrent}
                project_id={project_id}
                setMembersCurrent={setMembersCurrent}
            />
        </div>
    )
}


export default ProjectMembers