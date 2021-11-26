import { useState } from 'react'
import '../../assets/css/ProjectMembers.css'

type Props = {
    project_id: number
}

const ProjectMembers = ({ project_id }: Props): JSX.Element => {
    console.log(project_id)
    const [search, setSearch] = useState('')
    return (
        <div className='menu'>
            <div className='search'>
                <input type="text"
                    placeholder='Введите имя пользователя'
                    onChange={(e) => { setSearch(e.target.value); console.log(search) }} />
                <button onClick={() => {
                    const settings = JSON.parse(window.sessionStorage.getItem('settings'))
                    fetch(`http://localhost:8000/users/find`,
                        {   
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': settings['user']['X-API-Key']
                            },
                            body: JSON.stringify({name: search})
                        })
                            .then(response => response.json())
                            .then(data => console.log(data))
                }}> Поиск</button>
            </div>
        </div>
    )
}


export default ProjectMembers