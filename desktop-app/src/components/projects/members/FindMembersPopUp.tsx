import MembersList from './MembersList'
import Popup from 'reactjs-popup';

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}

interface Props {
    open: boolean
    project_id: number
    membersFind: Member[]
    addMember: (member: Member) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const FindMembersPopUp = ({ membersFind,
    project_id,
    addMember,
    open, setOpen }: Props): JSX.Element => {
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