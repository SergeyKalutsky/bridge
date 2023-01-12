import { ImCross } from 'react-icons/im'
import { BiSearch } from 'react-icons/bi'
import { Project } from '../types'
import { InputForm } from '../../../components/common'
import { createProjectProp } from './types'
import { useEffect, useState } from 'react'
import ProjectsCreate from '../ProjectsCreate'


function ProjectTypeRow({ projectName, roundTop, setProjectName }:
    {
        projectName: string,
        roundTop: boolean,
        setProjectName: React.Dispatch<React.SetStateAction<string>>
    }): JSX.Element {
    const rounded = roundTop ? 'rounded-t-l-lg' : ''
    return (<div
        onClick={() => setProjectName(projectName)}
        className={`pl-5 hover: cursor-pointer hover:bg-sky-700/75 hover:text-slate-200 text-slate-800 font-medium flex items-center w-full h-[40px] ${rounded}`}>
        {projectName}
    </div>)

}

function ProjecTypeRowSelected({ projectName, setProjectName, projectCreate, setProjectCreate }:
    {
        projectName: string,
        setProjectName: React.Dispatch<React.SetStateAction<string>>
        projectCreate: Project
        setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
    }): JSX.Element {
    const onclick = () => {
        setProjectName('')
        projectCreate.name = ''
        setProjectCreate(projectCreate)
    }
    return (
        <>
            <div className='w-full h-[60px] bg-sky-700/75 flex items-center rounded-lg border-2 border-sky-800'>
                <div className='pl-5 w-1/2 text-slate-100 text-2xl'>{projectName}</div>
                <div className='pr-6 w-1/2 text-slate-200 flex items-center justify-end'>
                    <div className='hover: cursor-pointer'>
                        <ImCross onClick={onclick} style={{ justifySelf: 'end', width: 15, height: 15 }} />
                    </div>
                </div>
            </div>
            <div className='mt-10  w-full h-4/5 bg-sky-600/60 border-2 rounded-md border-sky-800 overflow-scroll'>
                <span className='pl-2 text-slate-50 font-medium text-xl'>Здесь будет описание проекта...</span>
            </div>
        </>
    )
}


export function ProjectsSelectType({ projectCreate, setProjectCreate, setDisabled }: createProjectProp) {
    const libs = ['🐍 Python', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero']
    const [projectRows, setProjectRows] = useState<JSX.Element[]>()
    const [projectName, setProjectName] = useState('')

    useEffect(() => {
        if (projectCreate.name !== '') {
            setDisabled(false)
            setProjectName(projectCreate.name)
            return
        }
        if (projectName !== '') {
            setDisabled(false)
            projectCreate.name = projectName
            setProjectCreate(projectCreate)
            return
        }
        projectCreate.name = ''
        setProjectCreate(projectCreate)
        setDisabled(true)
    }, [projectName])

    const onChange = (e) => {
        const projects = []
        for (const project of libs) {
            if (e.target.value.length > 2 && project.toLowerCase().includes(e.target.value.toLowerCase())) {
                projects.push(project)
            }
        }
        const jsx = projects.map((name: string, index: number) =>
            <ProjectTypeRow projectName={name}
                roundTop={index == 0}
                key={index}
                setProjectName={setProjectName} />
        )
        setProjectRows(jsx)
    }
    if (projectName !== '') {
        return <ProjecTypeRowSelected
            projectName={projectName}
            setProjectName={setProjectName}
            projectCreate={projectCreate}
            setProjectCreate={setProjectCreate} />
    }
    return (
        <>
            <InputForm
                onChange={onChange}
                placeholder='Введите тип проекта'
                type='text'
                classInput='border-none pl-1'>
                {<BiSearch style={{ color: '#5A5A6E', width: 28, height: 30, paddingLeft: 5, backgroundColor: '#d4d4d8' }} />}
            </InputForm>
            <div className='mt-10  w-full h-4/5 bg-zinc-300 rounded-lg overflow-scroll'>
                {projectRows}
            </div>
        </>
    )
}