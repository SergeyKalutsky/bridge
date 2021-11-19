import { useState } from 'react'
import '../../assets/css/ProjectsFind.css'

const ProjectFind = (): JSX.Element => {
    const [key, setKey] = useState('')
    const [repo, setRepo] = useState('')
    return (
        <div className='menu'>
            <div className='search'>
                <input type="text"
                    placeholder='Введите ключ проекта'
                    onChange={(e) => { setKey(e.target.value) }} />
                <button onClick={() => {
                    fetch(`http://localhost:8000/projects/get/${key}`)
                        .then(response => response.json())
                        .then(data => setRepo(data['repo']))
                }}>Поиск</button>
            </div>
            {repo != '' ?
                <div className='project-found'>
                    {repo}
                    <button onClick={() => { 
                         fetch('http://localhost:8000/projects/members/add',
                         {
                             method: 'POST',
                             headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify({id:34, project: {id: 48}})
                         })
                         .then(response => response.json())
                         .then(data => console.log(data))
                    }}>Присоединится</button>
                </div> :
                null}
        </div>
    )
}

export default ProjectFind