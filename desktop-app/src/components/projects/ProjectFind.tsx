import { useState } from 'react'
import '../../assets/css/ProjectsFind.css'

type Project = {
    id: number
    name: string
}


const ProjectFind = (): JSX.Element => {
    const [key, setKey] = useState('')
    const [project, setProject] = useState<Project>({ id: 0, name: '' })
    return (
        <div className='menu'>
            <div className='search'>
                <input type="text"
                    placeholder='Введите ключ проекта'
                    onChange={(e) => { setKey(e.target.value) }} />
                <button onClick={() => {
                    const settings = JSON.parse(window.sessionStorage.getItem('settings'))
                    fetch(`http://localhost:8000/projects/get/${key}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'api-key': settings['user']['api_key'],
                                'user-id': settings['user']['id'],
                            }
                        })
                            .then(response => response.json())
                            .then(data => setProject(data))
                }}>Поиск</button>
            </div>
            {project.name != '' ?
                <div className='project-found'>
                    {project.name}
                    <button onClick={() => {
                        const settings = JSON.parse(window.sessionStorage.getItem('settings'))
                        fetch('http://localhost:8000/projects/members/add',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'api-key': settings['user']['api_key'],
                                    'user-id': settings['user']['id'],
                                },
                                body: JSON.stringify({ id: project.id })
                            })
                            .then(response => response.json())
                            .then(data => console.log(data))
                        window.location.reload()
                    }}>Присоединится</button>
                </div> :
                null}
        </div>
    )
}

export default ProjectFind