import { Button } from '../common'
import { ProjectsDescription } from './create/ProjectsDescription'
import { ProjectsSelectType } from './create/ProjectsSelectType'
import { ProjectsGithub } from './create/ProjectsGithub'
import { ProjectsInstall } from './create/ProjectsInstall'
import { HeaderPath } from './create/HeaderPath'
import { Project } from './types'
import { useState } from 'react'


interface Prop {
    addProject: (project: Project) => void
}

const dummyProject: Project = {
    id: null,
    islocal: true,
    name: '',
    description: '',
    isclassroom: 0,
    http: '',
    typeName: ''
    // http: templates[libs[0]].http
}

const ProjectsCreate = ({ addProject }: Prop): JSX.Element => {
    const [projectCreate, setProjectCreate] = useState<Project>(dummyProject)
    const [disabled, setDisabled] = useState(false)
    const [stage, setStage] = useState(0)
    const stageMap = [
        // {
        //     name: 'Тип проекта',
        //     jsx: <ProjectsSelectType
        //         projectCreate={projectCreate}
        //         setProjectCreate={setProjectCreate}
        //         setDisabled={setDisabled} />
        // },
        {
            name: 'Описание',
            jsx: <ProjectsDescription
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
        },
        {
            name: 'Установка',
            jsx: <ProjectsInstall
                projectCreate={projectCreate}
                setProjectCreate={setProjectCreate}
                setDisabled={setDisabled} />
        }]
    return (
        <>
            <HeaderPath path={`Создание проекта / ${stageMap[stage].name}`} />
            <div className='bg-zinc-500 flex flex-col h-[calc(100%-28px)] items-center justify-center overflow-scroll' >
                <div className='w-3/5 h-2/3'>
                    {/* <div className='w-full h-1/7 gap-y-2 flex flex-col'> */}
                    {stageMap[stage].jsx}
                    {/* </div> */}
                </div>
            </div >
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
