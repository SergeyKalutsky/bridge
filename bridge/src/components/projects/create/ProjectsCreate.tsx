import { Button } from '../../common'
import { ProjectsDescription } from './ProjectsDescription'
import { ProjectsSelectTemplate } from './ProjectsSelectTemplate'
import { ProjectsGithub } from './ProjectsGithub'
import { ProjectsInstall } from './ProjectsInstall'
import { HeaderPath } from './HeaderPath'
import { Project } from '../types'
import { useState } from 'react'


function ProjectsCreate({ dummyProject }: { dummyProject: Project }): JSX.Element {
    const [projectCreate, setProjectCreate] = useState<Project>(dummyProject)
    const [disabled, setDisabled] = useState(false)
    const [stage, setStage] = useState(0)
    const stageMap = [
        {
            name: 'Тип проекта',
            jsx: <ProjectsSelectTemplate
                projectCreate={projectCreate}
                setProjectCreate={setProjectCreate}
                setDisabled={setDisabled} />
        },
        {
            name: 'Описание',
            jsx: <ProjectsDescription
                projectCreate={projectCreate}
                setProjectCreate={setProjectCreate}
                setDisabled={setDisabled} />
        },
        {
            name: 'Установка',
            jsx: <ProjectsInstall
                projectCreate={projectCreate}
                setProjectCreate={setProjectCreate}
                setDisabled={setDisabled} />
        },
        {
            name: 'GitHub',
            jsx: <ProjectsGithub
                projectCreate={projectCreate}
                setProjectCreate={setProjectCreate}
                setDisabled={setDisabled} />
        }
    ]
    return (
        <>
            <HeaderPath path={`Создание проекта / ${stageMap[stage].name}`} />
            <div className='bg-zinc-500 flex flex-col h-[calc(100%-28px)] items-center justify-center overflow-scroll'>
                <div className='w-3/5 h-4/5'>
                    {stageMap[stage].jsx}
                </div>
            </div>
            <div className='bg-zinc-600 h-[60px] px-20 flex items-center drop-shadow-md'>
                <div className='w-[120px] h-[40px]'>
                    <Button onClick={() => setStage(stage - 1)} disabled={stage < 1}>{'<- Назад'}</Button>
                </div>
                <div className='grow'></div>
                <div className='w-[120px] h-[40px]'>
                    <Button onClick={() => { setStage(stage + 1) }} disabled={stage > 2 || disabled}>{'Далее ->'}</Button>
                </div>
            </div>
        </>
    )

}

export default ProjectsCreate
