import { Project } from '../types'
import { InputForm, } from '../../common'
import { LoadingIcon } from '../../common/Icons'
import { useState, useEffect } from 'react'

interface Prop {
    projectCreate: Project,
    setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
}

function isLatinString(s: string): boolean {
    for (let i = s.length; i--;) {
        const charCode = s.charCodeAt(i)
        if (charCode < 65 || charCode > 122)
            return false
    }
    return true
}

function projectNameError(name: string): string {
    if (name === '') {
        return 'Название проекта не может быть пустым'
    }
    if (name.includes(' ')) {
        return 'Название проекта не может содержать пробелы'
    }
    if (!isLatinString(name)) {
        return 'Название может содержать только латинские буквы'
    }
    for (const local of window.projects.getLocalProjectsNames()) {
        if (name === local) {
            return 'Проект с таким именем уже есть'
        }
    }
    return ''
}


export function ProjectsDescription({ projectCreate, setProjectCreate }: Prop) {
    const [error, setError] = useState<string>('')
    const loadInfo = <><LoadingIcon />
        <div className='text-lg text-slate-50 font-medium'>Установка...</div></>
    const handleClick = (e) => {
        if (projectNameError(projectCreate.name) !== '') return
        setError('')
    }
    return (
        <div className='w-full h-4/7 gap-y-2 flex flex-col'>
            <span className='text-red-400 font-medium text-xl'>{error}</span>
            <div className='w-[450px]'>
                <InputForm type="text" placeholder='Название'
                    onChange={(e) => { setProjectCreate({ ...projectCreate, name: e.target.value }) }} />
            </div>
            <textarea placeholder='Описание' className='w-[450px] h-[150px] text-xl rounded-lg focus:outline-none'
                onChange={(e) => { setProjectCreate({ ...projectCreate, description: e.target.value }) }} />
        </div>
    )
}