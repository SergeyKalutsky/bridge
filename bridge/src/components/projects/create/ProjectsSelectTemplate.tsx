import { BiSearch } from 'react-icons/bi'
import { InputForm } from '../../common'
import { Template } from '../../../types'
import { ProjectTemplateRow } from './ProjectTemplateRow'
import { projectCreateContext } from './ProjectsCreate'
import { ProjecTemplateRowSelected } from './ProjecTemplateRowSelected'
import { useContext, useEffect, useState } from 'react'


export function ProjectsSelectTemplate(): JSX.Element {
    const { projectCreate, setProjectCreate, setDisabled } = useContext(projectCreateContext)
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
        setProjectCreate({ ...projectCreate, template: template })
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