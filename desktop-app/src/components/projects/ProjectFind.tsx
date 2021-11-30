import { useState, useContext } from 'react'
import '../../assets/css/ProjectsFind.css'
import {SettingsContext} from '../../App'
import { KeyIcon } from '../Icons';

type Project = {
    id: number
    name: string
}


const ProjectFind = (): JSX.Element => {
    const settings = useContext(SettingsContext)
    const [key, setKey] = useState('')
    const [project, setProject] = useState<Project>({ id: 0, name: '' })
    return (
        <div className='menu'>
            <span className="AddFr">Пригласить друга в проект</span>
            <div className='search'>
                <input type="text"
                    placeholder='Введите ключ проекта'
                    onChange={(e) => { setKey(e.target.value) }} />
                <button onClick={() => {
                    fetch(`http://localhost:8000/projects/get/${key}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'api-key': settings['user']['X-API-Key'],
                            }
                        })
                            .then(response => response.json())
                            .then(data => setProject(data))
                }}>
                    <KeyIcon />
                </button>
            </div>
            {project.name != '' ?
                <div className='project-found'>
                    {project.name}
                    <button onClick={() => {
                        fetch('http://localhost:8000/projects/members/add',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'api-key': settings['user']['X-API-Key'],
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