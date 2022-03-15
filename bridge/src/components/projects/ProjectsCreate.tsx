import { useState } from 'react'
import { Project } from './types'
import { InputForm, Button } from '../common'
import { createProject } from '../../lib/api/gitlab'

interface Prop {
    addProject: (project: Project) => void
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
    const [checked, setChecked] = useState<number>(0)
    const [project, setProject] = useState<Project>(dummyProject)


    const handleClick = () => {
        addProject(project)
    }
    return (
        <>
            <h1 className='font-medium bg-zinc-500 pl-2 text-xl text-gray-200 underline'>Создание проекта</h1>
            <div className='bg-zinc-500 flex flex-col h-full items-center justify-center'>
                <div className='w-3/5 h-1/2'>
                    <div className='w-full gap-y-5 flex flex-col'>
                        <InputForm type="text" placeholder='Название'
                            onChange={(e) => { setProject({ ...project, name: e.target.value }) }} />
                        <textarea placeholder='Описание' className='w-full h-[150px] text-xl rounded-lg focus:outline-none'
                            onChange={(e) => { setProject({ ...project, description: e.target.value }) }} />
                    </div>
                    <div className='w-full gap-y-2 flex flex-col mt-2'>
                        <div>
                            <input type="checkbox"
                                className='scale-150'
                                checked={checked == 0}
                                onChange={() => { setChecked(0); setProject({ ...project, isclassroom: 0 }) }} />
                            <label className='ml-2 text-xl font-medium text-white'>Личный проект</label>
                        </div>
                        <div>
                            <input type="checkbox"
                                className='scale-150'
                                checked={checked == 1}
                                onChange={() => { setChecked(1); setProject({ ...project, isclassroom: 1 }) }} />
                            <label className='ml-2 text-xl font-medium text-white'>Для обучения</label>
                        </div>
                        <Button onClick={handleClick} btnText='Создать' />
                    </div>
                </div>
            </div >
        </>
    )

}

export default ProjectsCreate