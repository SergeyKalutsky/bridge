import { useContext, useEffect, useState } from 'react'
import '../../../assets/css/ProjectMembers.css'
import { SettingsContext } from '../../../App'
import CurrentMembers from './CurrentMembers'
import MembersList from './MembersList'
import Popup from 'reactjs-popup';

type Props = {
    project_id: number
}

interface Member {
    id: number
    name: string
    iscurrent?: boolean
}

interface MembersPopUpProp {
    membersFind: Member[]
    project_id: number
    setMembersCureent: React.Dispatch<React.SetStateAction<Member[]>>
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const MembersPopUp = ({ membersFind,
    project_id,
    setMembersCureent,
    open, setOpen }: MembersPopUpProp): JSX.Element => {
    const membersArray = membersFind.map((member) =>
        <MembersList member={member}
            project_id={project_id}
            key={member.id}
            setMembersCureent={setMembersCureent} />
    )
    return (
        <Popup
            open={open}
            onClose={() => setOpen(false)}
            closeOnDocumentClick
            position="right center"
            modal>
            <div className="modal">
                {membersArray}
                <button className="close" onClick={() => {
                    setOpen(false)
                }}>
                    ОК
                </button>
            </div>
        </Popup>
    )
}


const ProjectMembers = ({ project_id }: Props): JSX.Element => {
    const { settings, setSettings } = useContext(SettingsContext)
    const [open, setOpen] = useState(false)
    const [membersFind, setMembersFind] = useState<Member[]>([])
    const [membersCurrent, setMembersCureent] = useState<Member[]>([])
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
            .then(data => setMembersCureent(data))
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
            <MembersPopUp membersFind={membersFind}
                project_id={project_id}
                setMembersCureent={setMembersCureent}
                open={open}
                setOpen={setOpen} />
            <CurrentMembers members={membersCurrent}
                project_id={project_id}
                setMembersCureent={setMembersCureent}
            />
        </div>
    )
}


export default ProjectMembers