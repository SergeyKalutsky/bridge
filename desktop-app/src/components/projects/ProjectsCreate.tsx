import { useState } from 'react'
import '../../assets/css/ProjectsCreate.css'

type Project = {
    name: string,
    description?: string,
    isclassroom: number
}

const ProjectsCreate = (): JSX.Element => {
    const [checked, setChecked] = useState<number>(0)

    const [project, setProject] = useState<Project>({
        name: '',
        description: '',
        isclassroom: 0
    })
    return (
        <div className='menu'>
            <div className='crete-inputs row'>
                <div className='row'>
                    <input type="text" placeholder='Название проекта'
                        onChange={(e) => { setProject({ ...project, name: e.target.value }) }} />
                </div>
                <div className='row'>
                    <textarea placeholder='Описание'
                        onChange={(e) => { setProject({ ...project, description: e.target.value }) }} />
                </div>
                <div className='row checkbox'>
                    <div>
                        <input type="checkbox"
                            checked={checked == 0}
                            onChange={() => { setChecked(0); setProject({ ...project, isclassroom: 0 }) }} />
                        <label>Личный проект</label>
                    </div>
                    <div>
                        <input type="checkbox"
                            checked={checked == 1}
                            onChange={() => { setChecked(1); setProject({ ...project, isclassroom: 1 }) }} />
                        <label>Для обучения</label>
                    </div>
                </div>
                <div className='row'>
                    <button type='submit' onClick={() => {
                        const settings = JSON.parse(window.sessionStorage.getItem('settings'))
                        fetch('http://localhost:8000/projects/create',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': settings['user']['X-API-Key'],
                                },
                                body: JSON.stringify(project)

                            })
                            .then(response => response.json())
                            .then(data => {data['status'] == 'created' ? window.location.reload(): console.log(data)})

                    }}>Создать</button>
                </div>
            </div>
        </div >

    )

}

export default ProjectsCreate