import { useEffect, useState, useContext } from 'react'
import { SettingsContext } from '../../../App'
import MembersList from './MembersList'
import Popup from 'reactjs-popup';
import { Member } from './ProjectMembers'
import { findUser } from '../../../lib/api/index'

interface Props {
    search: string
    open: boolean
    membersCurrent: Member[]
    project_id: number
    addMember: (member: Member) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const FindMembersPopUp = ({ membersCurrent,
    search,
    project_id,
    addMember,
    open, setOpen }: Props): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const [membersFind, setMembersFind] = useState<Member[]>([])

    const mapProjectMembership = (membersFound: Member[]) => {
        membersFound.map((member, index) => {
            for (const memberCurrent of membersCurrent) {
                if (memberCurrent.id === member.id) {
                    member.iscurrent = true
                    membersFound[index] = member
                    return
                }
            }
            member.iscurrent = false
            membersFound[index] = member
        })
        setMembersFind(membersFound)
    }
    useEffect(() => {
        findUser(settings, search)
            .then(data => mapProjectMembership(data))
    }, [search, membersCurrent])

    const membersArray = membersFind.map((member) =>
        <MembersList member={member}
            project_id={project_id}
            key={member.id}
            addMember={addMember} />
    )
    return (
        <Popup
            open={open}
            onClose={() => setOpen(false)}
            closeOnDocumentClick
            position="right center"
            modal>
            <div className="modal">
                <div className='menu'>
                    <div className='search'>
                        {membersArray}
                        <button className="close" onClick={() => {
                            setOpen(false)
                        }}>
                            ОК
                        </button>
                    </div>
                </div>
            </div>
        </Popup>
    )
}

export default FindMembersPopUp