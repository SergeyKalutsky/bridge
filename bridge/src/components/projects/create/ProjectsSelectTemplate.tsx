import { ImCross } from 'react-icons/im'
import { BiSearch } from 'react-icons/bi'
import { Project } from '../types'
import { InputForm } from '../../common'
import { createProjectProp } from './types'
import { useEffect, useState } from 'react'
import { Template } from '../../../types'


function ProjectTemplateRow({ template, roundTop, setTemplate }:
    {
        template: Template,
        roundTop: boolean,
        setTemplate: React.Dispatch<React.SetStateAction<Template>>
    }): JSX.Element {
    const rounded = roundTop ? 'rounded-t-l-lg' : ''
    return (<div
        onClick={() => setTemplate(template)}
        className={`pl-5 hover: cursor-pointer hover:bg-sky-700/75 hover:text-slate-200 text-slate-800 font-medium flex items-center w-full h-[40px] ${rounded}`}>
        {template.name}
    </div>)

}

function ProjecTemplateRowSelected({ template, setTemplate, projectCreate, setProjectCreate, setTemplateRows }:
    {
        template: Template,
        setTemplate: React.Dispatch<React.SetStateAction<Template>>
        projectCreate: Project
        setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
        setTemplateRows: React.Dispatch<React.SetStateAction<JSX.Element[]>>
    }): JSX.Element {
    const onclick = () => {
        const dummy = { name: '', http: '', pkgs: [], description: '' }
        setTemplate(dummy)
        projectCreate.template = dummy
        setProjectCreate(projectCreate)
        setTemplateRows([])
    }
    return (
        <>
            <div className='w-full h-[60px] bg-sky-700/75 flex items-center rounded-lg border-2 border-sky-800'>
                <div className='pl-5 w-1/2 text-slate-100 text-2xl'>{template.name}</div>
                <div className='pr-6 w-1/2 text-slate-200 flex items-center justify-end'>
                    <div className='hover: cursor-pointer'>
                        <ImCross onClick={onclick} style={{ justifySelf: 'end', width: 15, height: 15 }} />
                    </div>
                </div>
            </div>
            <div className='mt-10  w-full h-4/5 bg-sky-600/60 border-2 rounded-md border-sky-800 overflow-scroll'>
                <span className='pl-2 text-slate-50 font-medium text-xl'>{template.description}</span>
            </div>
        </>
    )
}


export function ProjectsSelectTemplate({ projectCreate, setProjectCreate, setDisabled }: createProjectProp) {
    const [templateRows, setTemplateRows] = useState<JSX.Element[]>()
    const [template, setTemplate] = useState<Template>(null)

    useEffect(() => {
        if (projectCreate.template !== null) {
            setDisabled(false)
            setTemplate(projectCreate.template)
            return
        }
        if (template !== null) {
            setDisabled(false)
            projectCreate.template = template
            setProjectCreate(projectCreate)
            return
        }
        projectCreate = { ...projectCreate, template: template }
        setProjectCreate(projectCreate)
        setDisabled(true)
    }, [template])

    const onChange = async (e) => {
        const templates_local = []
        const templates = await window.projects.getProjectTemplates()
        for (const template of templates) {
            if (e.target.value.length > 2 && template.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                templates_local.push(template)
            }
        }
        const jsx = templates_local.map((template: Template, index: number) =>
            <ProjectTemplateRow template={template}
                roundTop={index == 0}
                key={index}
                setTemplate={setTemplate} />
        )
        setTemplateRows(jsx)
    }
    if (template !== null) {
        return <ProjecTemplateRowSelected
            template={template}
            setTemplate={setTemplate}
            projectCreate={projectCreate}
            setProjectCreate={setProjectCreate}
            setTemplateRows={setTemplateRows} />
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
            {templateRows !== undefined && templateRows.length > 0 ?
                <div className='mt-10  w-full h-4/5 bg-zinc-50 rounded-lg overflow-scroll'>
                    {templateRows}
                </div> :
                null}
        </>
    )
}