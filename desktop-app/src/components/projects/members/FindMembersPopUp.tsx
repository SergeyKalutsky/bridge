import MembersList from './MembersList'
import Popup from 'reactjs-popup';

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}

interface Props {
    membersFind: Member[]
    project_id: number
    setMembersCurrent: React.Dispatch<React.SetStateAction<Member[]>>
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const FindMembersPopUp = ({ membersFind,
    project_id,
    setMembersCurrent,
    open, setOpen }: Props): JSX.Element => {
    const membersArray = membersFind.map((member) =>
        <MembersList member={member}
            project_id={project_id}
            key={member.id}
            setMembersCurrent={setMembersCurrent} />
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