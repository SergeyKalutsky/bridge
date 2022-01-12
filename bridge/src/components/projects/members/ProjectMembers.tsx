import { useState, useEffect } from 'react'
import Button from '../../common/Button'
import InputForm from '../../common/InputForm'
import CurrentMembers from './CurrentMembers'
import FindMembersPopUp from '../popups/FindMembersPopUp'
import { listProjectMembers } from '../../../lib/api/gitlab/index'
import { Member } from '../types'

type Props = {
    project_id: number
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
        listProjectMembers(window.settings.get('user'), project_id)
            .then(data => data !== null ? setMembersCurrent(data) : null)
    }, [project_id])
    return (
        <>
            <h1 className='font-medium bg-zinc-500 pl-2 text-xl text-gray-200 underline'>Пригласить друга</h1>
            <div className='flex justify-between items-center w-full h-full bg-zinc-500'>
                <div className='flex flex-col justify-between items-center w-full h-3/4 bg-zinc-500'>
                    <div className='w-3/5 mt-2 flex items-center justify-center gap-x-5'>
                        <InputForm type="text"
                            placeholder='Введите имя'
                            onChange={(e) => { setSearch(e.target.value) }} />
                        <Button onClick={() => { setOpen(true) }} btnText='Поиск' />
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
            </div>
        </>
    )
}


export default ProjectMembers