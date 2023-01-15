import { ImCross } from 'react-icons/im'
import { BiSearch } from 'react-icons/bi'
import { Project } from '../types'
import { InputForm } from '../../../components/common'
import { createProjectProp } from './types'
import { useEffect, useState } from 'react'
import { Template } from '../../../types'


function ProjectTypeRow({ project, roundTop, setProject }:
    {
        project: Template,
        roundTop: boolean,
        setProject: React.Dispatch<React.SetStateAction<Template>>
    }): JSX.Element {
    const rounded = roundTop ? 'rounded-t-l-lg' : ''
    return (<div
        onClick={() => setProject(project)}
        className={`pl-5 hover: cursor-pointer hover:bg-sky-700/75 hover:text-slate-200 text-slate-800 font-medium flex items-center w-full h-[40px] ${rounded}`}>
        {project.name}
    </div>)

}

function ProjecTypeRowSelected({ project, setProject, projectCreate, setProjectCreate, setProjectRows }:
    {
        project: Template,
        setProject: React.Dispatch<React.SetStateAction<Template>>
        projectCreate: Project
        setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
        setProjectRows: React.Dispatch<React.SetStateAction<JSX.Element[]>>
    }): JSX.Element {
    const onclick = () => {
        const dummy = {name:'', http:'', pkgs:[], description:''}
        setProject(dummy)
        projectCreate.template = dummy
        setProjectCreate(projectCreate)
        setProjectRows([])
    }
    return (
        <>
            <div className='w-full h-[60px] bg-sky-700/75 flex items-center rounded-lg border-2 border-sky-800'>
                <div className='pl-5 w-1/2 text-slate-100 text-2xl'>{project.name}</div>
                <div className='pr-6 w-1/2 text-slate-200 flex items-center justify-end'>
                    <div className='hover: cursor-pointer'>
                        <ImCross onClick={onclick} style={{ justifySelf: 'end', width: 15, height: 15 }} />
                    </div>
                </div>
            </div>
            <div className='mt-10  w-full h-4/5 bg-sky-600/60 border-2 rounded-md border-sky-800 overflow-scroll'>
                <span className='pl-2 text-slate-50 font-medium text-xl'>{project.description}</span>
            </div>
        </>
    )
}


export function ProjectsSelectType({ projectCreate, setProjectCreate, setDisabled }: createProjectProp) {
    const [projectRows, setProjectRows] = useState<JSX.Element[]>()
    const [project, setProject] = useState<Template>(projectCreate.template)

    useEffect(() => {
        if (projectCreate.template.name !== '') {
            setDisabled(false)
            setProject(projectCreate.template)
            return
        }
        if (project.name !== '') {
            setDisabled(false)
            projectCreate.template = project
            setProjectCreate(projectCreate)
            return
        }
        projectCreate.template.name = ''
        setProjectCreate(projectCreate)
        setDisabled(true)
    }, [project])

    const onChange = async (e) => {
        const projects = []
        const templates = await window.projects.getProjectTemplates()
        for (const template of templates) {
            if (e.target.value.length > 2 && template.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                projects.push(template)
            }
        }
        const jsx = projects.map((project: Template, index: number) =>
            <ProjectTypeRow project={project}
                roundTop={index == 0}
                key={index}
                setProject={setProject} />
        )
        setProjectRows(jsx)
    }
    if (project.name !== '') {
        return <ProjecTypeRowSelected
            project={project}
            setProject={setProject}
            projectCreate={projectCreate}
            setProjectCreate={setProjectCreate}
            setProjectRows={setProjectRows} />
    }
    return (
        <>
            <InputForm
                onChange={onChange}
                placeholder='Введите тип проекта'
                type='text'
                classInput='border-none pl-1'>
                {<BiSearch style={{ color: '#5A5A6E', width: 28, height: 30, paddingLeft: 5, backgroundColor: '#fafafa' }} />}
            </InputForm>
            {projectRows !== undefined && projectRows.length > 0 ?
                <div className='mt-10  w-full h-4/5 bg-zinc-50 rounded-lg overflow-scroll'>
                    {projectRows}
                </div> :
                null}
        </>
    )
}