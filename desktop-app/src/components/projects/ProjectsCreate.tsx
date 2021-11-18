import { useState } from 'react'
import '../../assets/css/ProjectsCreate.css'

type Form = {
    repo: string,
    description: string,
    isclassrom: boolean
}

const ProjectsCreate = (): JSX.Element => {
    const [checked, setChecked] = useState<number>(0)
    const [form, setForm] = useState<Form>()
    console.log(form)
    return (
        <div className='menu'>
            <div className='crete-inputs row'>
                <div className='row'>
                    <input type="text" placeholder='Название проекта'
                        onChange={(e) => { setForm({ ...form, repo: e.target.value }) }} />
                </div>
                <div className='row'>
                    <textarea placeholder='Описание' 
                    onChange={(e) => {setForm({...form, description: e.target.value})}}/>
                </div>
                <div className='row checkbox'>
                    <div>
                        <input type="checkbox" checked={checked == 0} onChange={()=>{setChecked(0)}}/>
                        <label>Личный проект</label>
                    </div>
                    <div>
                        <input type="checkbox" checked={checked == 1} onChange={()=>{setChecked(1)}}/>
                        <label>Для обучения</label>
                    </div>
                </div>
                <div className='row'>
                    <button>Создать</button>
                </div>
            </div>
        </div>

    )

}

export default ProjectsCreate