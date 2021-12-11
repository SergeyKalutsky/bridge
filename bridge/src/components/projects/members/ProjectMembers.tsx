import { useState, useEffect} from 'react'
import '../../../assets/css/ProjectMembers.css'
import CurrentMembers from './CurrentMembers'
import FindMembersPopUp from './FindMembersPopUp'
import { listProjectMembers } from '../../../lib/api/index'

type Props = {
    project_id: number
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}


const ProjectMembers = ({ project_id }: Props): JSX.Element => {
    const [open, setOpen] = useState(false)
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

    useEffect(() => {
        listProjectMembers(window.settings.get(), project_id)
            .then(data => data !== null ? setMembersCurrent(data) : null)
    }, [])
    return (
        <div className='project-members'>
            <h1>Пригласить друга в проект</h1>
            <div className='search'>
                <input type="text"
                    placeholder='Введите ник пользователя'
                    onChange={(e) => { setSearch(e.target.value) }} />
                <button onClick={() => {
                    setOpen(true)
                }}> Поиск</button>
            </div>
            <FindMembersPopUp membersCurrent={membersCurrent}
                search={search}
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


export { ProjectMembers, Member }