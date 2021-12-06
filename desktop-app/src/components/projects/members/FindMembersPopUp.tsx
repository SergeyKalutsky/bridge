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
    const [memberFound, setmemberFound] = useState<Member>(null)

    useEffect(() => {
        findUser(settings, search)
            .then(data => setmemberFound(data))
    }, [search, membersCurrent])

    return (
        <Popup
            open={open}
            onClose={() => setOpen(false)}
            closeOnDocumentClick
            position="right center"
            modal>
            <div className="modal">
                <div className='search'>
                    {memberFound !== null ?
                        memberFound.name :
                        <div className='not-found'>
                            <span>К сожалению с таким ником никто не найден</span>
                            < button className="close" onClick={() => {
                                setOpen(false)
                            }}>
                                ОК
                            </button>
                        </div>}
                </div>
            </div>
        </Popup >
    )
}

export default FindMembersPopUp