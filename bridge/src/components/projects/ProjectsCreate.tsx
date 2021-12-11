import { useState } from 'react'
import '../../assets/css/ProjectsCreate.css'
import { createProject } from '../../lib/api/index'
import { Project } from './Projects'

interface Prop {
    addProject: React.Dispatch<React.SetStateAction<Project[]>>
}

const dummyProject: Project = {
    id: null,
    islocal: true,
    name: '',
    description: '',
    isclassroom: 0,
    http: ''
}

const ProjectsCreate = ({ addProject }: Prop): JSX.Element => {
    const [ settings, setSettings ] = useState()
    const [checked, setChecked] = useState<number>(0)
    const [project, setProject] = useState<Project>(dummyProject)

    return (
        <div className='project-create'>
            <div className='crete-inputs'>
                <h1>Создание проекта</h1>
                <div className='row'>
                    <input type="text" placeholder='Название проекта'
                        onChange={(e) => { setProject({ ...project, name: e.target.value }) }} />
                </div>
                <div className='row'>
                    <textarea placeholder='Описание'
                        onChange={(e) => { setProject({ ...project, description: e.target.value }) }} />
                </div>
                <div className='row checkbox'>
                    <div className="check">
                        <input type="checkbox"
                            checked={checked == 0}
                            onChange={() => { setChecked(0); setProject({ ...project, isclassroom: 0 }) }} />
                        <label>Личный проект</label>
                    </div>
                    <div className="check">
                        <input type="checkbox"
                            checked={checked == 1}
                            onChange={() => { setChecked(1); setProject({ ...project, isclassroom: 1 }) }} />
                        <label>Для обучения</label>
                    </div>
                </div>
                <div className='row'>
                    <button className='sumbit-form' type='submit' onClick={() => {
                        createProject(settings, project)
                            .then(data => addProject(data['project']))
                    }}>Создать</button>
                </div>
            </div>
        </div >

    )

}

export default ProjectsCreate