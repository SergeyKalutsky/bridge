import { ImCross } from 'react-icons/im'
import { BiSearch } from 'react-icons/bi'
import { InputForm } from '../../../components/common'
import { createProjectProp } from './types'
import { useEffect, useState } from 'react'


function ProjectTypeRow({ projectName, roundTop, setProjectName }:
    {
        projectName: string,
        roundTop: boolean,
        setProjectName: React.Dispatch<React.SetStateAction<string>>
    }): JSX.Element {
    const rounded = roundTop ? 'rounded-t-l-lg' : ''
    return (<div
        onClick={() => setProjectName(projectName)}
        className={`pl-5 hover: cursor-pointer hover:bg-sky-700/75 hover:text-slate-200 text-slate-700 flex items-center w-full h-[40px] ${rounded}`}>
        {projectName}
    </div>)

}

function ProjecTypeRowSelected({ projectName, setProjectName }:
    {
        projectName: string,
        setProjectName: React.Dispatch<React.SetStateAction<string>>
    }): JSX.Element {
    return (
        <div className='w-full h-[60px] bg-sky-700/75 flex items-center rounded-lg border-2 border-sky-800'>
            <div className='pl-5 w-1/2 text-slate-200 text-2xl'>{projectName}</div>
            <div className='pr-6 w-1/2 text-slate-200 flex items-center justify-end'>
                <div className='hover: cursor-pointer'>
                    <ImCross onClick={() => setProjectName('')} style={{ justifySelf: 'end', width: 15, height: 15 }} />
                </div>
            </div>
        </div>
    )
}


export function ProjectsSelectType({ projectCreate, setProjectCreate, setDisabled }: createProjectProp) {
    const libs = ['🐍 Python', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero', '🕸️ Python Flask', '🤖 Python Discord', '0️⃣ Python Pgzero']
    const [projectRows, setProjectRows] = useState<JSX.Element[]>()
    const [projectName, setProjectName] = useState('')

    // useEffect(() => {
    //     if (projectName !== '') {
    //         console.log('here')
    //         setDisabled(false)
    //     }
    //     setDisabled(true)
    // }, [projectName])

    const onChange = (e) => {
        const projects = []
        for (const project of libs) {
            console.log(project.toLowerCase().includes(e.target.value.toLowerCase()))
            if (e.target.value.length > 2 && project.toLowerCase().includes(e.target.value.toLowerCase())) {
                projects.push(project)
                console.log('here')
            }
        }
        const jsx = projects.map((name: string, index: number) =>
            <ProjectTypeRow projectName={name} roundTop={index == 0} key={index} setProjectName={setProjectName} />
        )
        console.log(projects)
        setProjectRows(jsx)
    }
    if (projectName !== '') {
        return <ProjecTypeRowSelected projectName={projectName} setProjectName={setProjectName} />
    }
    return (
        <>
            <InputForm
                onChange={onChange}
                placeholder='Введите тип проекта'
                type='text'
                classInput='border-none pl-1'>
                {<BiSearch style={{ color: '#71717a', width: 28, height: 30, paddingLeft: 5, backgroundColor: '#d4d4d8' }} />}
            </InputForm>
            <div className='mt-10  w-full h-4/5 bg-zinc-300 rounded-lg overflow-scroll'>
                {projectRows}
            </div>
        </>
    )
}