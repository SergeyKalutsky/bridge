import { ConstructionOutlined } from '@mui/icons-material'
import { useState } from 'react'
import '../../assets/css/ProjectsCreate.css'
import storage from 'electron-json-storage';

type Form = {
    user_login: string,
    repo: string,
    description: string,
    isclassrom: boolean
}

const ProjectsCreate = (): JSX.Element => {
    const [checked, setChecked] = useState<number>(0)

    const [form, setForm] = useState<Form>({
        user_login: 'sergey',
        repo: '',
        description: '',
        isclassrom: false
    })
    return (
        <div className='menu'>
            <div className='crete-inputs row'>
                <div className='row'>
                    <input type="text" placeholder='Название проекта'
                        onChange={(e) => { setForm({ ...form, repo: e.target.value }) }} />
                </div>
                <div className='row'>
                    <textarea placeholder='Описание'
                        onChange={(e) => { setForm({ ...form, description: e.target.value }) }} />
                </div>
                <div className='row checkbox'>
                    <div>
                        <input type="checkbox"
                            checked={checked == 0}
                            onChange={() => { setChecked(0); setForm({ ...form, isclassrom: false }) }} />
                        <label>Личный проект</label>
                    </div>
                    <div>
                        <input type="checkbox"
                            checked={checked == 1}
                            onChange={() => { setChecked(1); setForm({ ...form, isclassrom: true }) }} />
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
                                    'api-key': settings['user']['api_key'],
                                    'user-id': settings['user']['id'],
                                },
                                body: JSON.stringify(form)

                            })
                            .then(response => response.json())
                            .then(data => data['res'] == 'created' ? window.location.reload() : console.log(data))

                    }}>Создать</button>
                </div>
            </div>
        </div >

    )

}

export default ProjectsCreate