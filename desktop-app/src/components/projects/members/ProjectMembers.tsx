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

    const addMember = (member: Member) => { setMembersCurrent([...membersCurrent, member]) }
    const removeMember = (member: Member) => {
        const newMemberList = []
        for (const oldMember of membersCurrent) {
            if (oldMember.id !== member.id) {
                newMemberList.push(oldMember)
            }
        }
        setMembersCurrent(newMemberList)
    }
    const mapProjectMembership = (membersFound: Member[]) => {
        membersFound.map((member, index) => {
            if (membersCurrent.length === 0)  {
                membersFound[index] = {...member, iscurrent: false}
            }
            for (const memberCurrent of membersCurrent) {
                member.iscurrent = memberCurrent.id === member.id ? true : false
                membersFound[index] = member
            }
        })
        setMembersFind(membersFound)
    }
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
                        .then(data => mapProjectMembership(data))
                    setOpen(true)
                }}> Поиск</button>
            </div>
            <FindMembersPopUp membersFind={membersFind}
                project_id={project_id}
                addMember={addMember}
                open={open}
                setOpen={setOpen} />
            <CurrentMembers members={membersCurrent}
                project_id={project_id}
                removeMember={removeMember}
            />
        </div>
    )
}


export default ProjectMembers