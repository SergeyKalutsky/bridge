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
                    fetch(`http://172.29.0.1:8000/projects/get/${key}`)
                        .then(response => response.json())
                        .then(data => setRepo(data['repo']))
                }}>Поиск</button>
            </div>
            {repo != '' ?
                <div className='project-found'>
                    {repo}
                    <button>Присоединится</button>
                </div> :
                null}
        </div>
    )
}

export default ProjectFind