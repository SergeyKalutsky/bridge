interface Member {
    id: number
    name: string
    iscurrent?: boolean
}

type FoundMemberListProps = {
    member: Member
    project_id: number
    forceUpdate: boolean
    setForceUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const FoundMemberList = ({ member,
    project_id,
    forceUpdate, 
    setForceUpdate }: FoundMemberListProps): JSX.Element => {

    return (
        <div className='project-found'>
            {member.name}
            <button onClick={() => {
                const settings = JSON.parse(window.sessionStorage.getItem('settings'))
                fetch('http://localhost:8000/members/add',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': settings['user']['X-API-Key']
                        },
                        body: JSON.stringify({
                            user_id: member.id,
                            project_id: project_id
                        })
                    })
                setForceUpdate(forceUpdate == true ? false : true)
            }}>Пригласить</button>
        </div>
    )
}

export default FoundMemberList