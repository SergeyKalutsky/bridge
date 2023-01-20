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
    const [template, setTemplate] = useState<Template>(projectCreate.template)

    useEffect(() => {
        setDisabled(!template)
    }, [template])

    useEffect(() => {
        if (projectCreate.template) {
            setTemplate(projectCreate.template)
            return
        }
        setProjectCreate({ ...projectCreate, template: template })
    }, [template])

    const onChange = async (e) => {
        const templates = await window.projects.getProjectTemplates(e.target.value.toLowerCase())
        const jsx = templates.map((template: Template, index: number) =>
            <ProjectTemplateRow template={template}
                roundTop={index == 0}
                key={index}
                setTemplate={setTemplate} />
        )
        setTemplateRows(jsx)
    }
    if (template) {
        return <ProjecTemplateRowSelected
            template={template}
            setTemplate={setTemplate}
            setTemplateRows={setTemplateRows} />
    }
    return (
        <>
            <div className='h-3/5 w-3/5 max-w-2xl'>
                <InputForm
                    onChange={onChange}
                    placeholder='Введите тип проекта: Python, Go, bot...'
                    type='text'
                    classInput='border-none pl-3 pt-3 pb-3 pr-5 text-2xl placeholder-slate-400'>
                    {<BiSearch style={{ color: '#5A5A6E', width: 40, height: 40, paddingLeft: 10, backgroundColor: '#fafafa' }} />}
                </InputForm>
                {templateRows !== undefined && templateRows.length > 0 ?
                    <div className='mt-10  w-full h-4/5 bg-zinc-50 rounded-lg overflow-scroll'>
                        {templateRows}
                    </div> :
                    null}
            </div>
        </>
    )
}