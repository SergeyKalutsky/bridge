import { useState, useEffect } from 'react'
import Button from '../../common/Button'
import InputForm from '../../common/InputForm'
import '../../../assets/css/ProjectMembers.css'
import CurrentMembers from './CurrentMembers'
import FindMembersPopUp from '../popups/FindMembersPopUp'
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
    }, [project_id])
    return (
        <>
            <div className='flex flex-col justify-between items-center w-full h-full bg-zinc-700'>
                <h1>Пригласить друга в проект</h1>
                <div className='w-3/5 mt-2 flex items-center justify-center'>
                    <InputForm type="text"
                        placeholder='Введите имя'
                        onChange={(e) => { setSearch(e.target.value) }} />
                    <Button onClick={() => {setOpen(true)}} btnText='Поиск' /> 
                </div>
                <CurrentMembers members={membersCurrent}
                    project_id={project_id}
                    removeMember={removeMember}
                />
            </div>
            <FindMembersPopUp membersCurrent={membersCurrent}
                search={search}
                project_id={project_id}
                addMember={addMember}
                open={open}
                setOpen={setOpen} />
        </>
    )
}


export { ProjectMembers, Member }