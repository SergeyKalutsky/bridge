import { createProjectProp } from './types'
import { InputForm, } from '../../common'
import { useState, useEffect } from 'react'
import { Button } from '../../common'


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


export function ProjectsDescription({ projectCreate, setProjectCreate, setDisabled }: createProjectProp) {
    const [error, setError] = useState<string>('')
    useEffect(() => {
        if (projectCreate.name !== '') return
        setDisabled(true)
    }, [])

    const onChange = (e) => {
        setProjectCreate({ ...projectCreate, name: e.target.value })
        const error = projectNameError(e.target.value)
        if (error !== '') {
            setError('⚠️ ' + error)
            setDisabled(true)
            return
        }
        setError('')
        setDisabled(false)
    }
    const onClick = async () => {
        await window.dialogue.openImageFile()
    }
    return (
        <div className='w-full h-4/7 gap-y-4 flex flex-col'>
            <div className='w-full flex justify-center items-center'>
                <div className='w-1/2 h-[40px]'>
                    <Button width={24} btnText='Загрузить изображение' onClick={onClick} />
                </div>
            </div>
            <span className='text-stone-50 font-medium text-xl h-[30px]'>{error}</span>
            <div className='w-full'>
                <InputForm
                    type="text"
                    placeholder='Название'
                    classInput='border-none pl-4'
                    value={projectCreate.name}
                    onChange={onChange} />
            </div>
            <textarea placeholder='Описание'
                className='w-full pl-4 pt-2 bg-zinc-50 placeholder-slate-500 font-medium text-slate-700 h-[150px] text-xl rounded-lg focus:outline-none'
                onChange={(e) => { setProjectCreate({ ...projectCreate, description: e.target.value }) }}
                value={projectCreate.description}
            />
        </div>
    )
}