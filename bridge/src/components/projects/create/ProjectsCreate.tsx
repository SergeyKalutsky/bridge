import { Project } from '../types'
import { Button } from '../../common'
import { HeaderPath } from './HeaderPath'
import { createContext, useContext, useState } from 'react'
import { ProjectsGithub } from './ProjectsGithub'
import { ProjectsInstall } from './ProjectsInstall'
import { ProjectsDescription } from './ProjectsDescription'
import { ProjectsSelectTemplate } from './ProjectsSelectTemplate'
import { projectContext } from '../Projects'

interface ProjectCreateContext {
    projectCreate: Project,
    setProjectCreate: React.Dispatch<React.SetStateAction<Project>>
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export const projectCreateContext = createContext<ProjectCreateContext>(null)

const dummyProject: Project = {
    id: null,
    islocal: true,
    name: '',
    description: '',
    http: '',
    thumbnailPath: '',
    template: null
}

export function ProjectsCreate(): JSX.Element {
    const [projectCreate, setProjectCreate] = useState<Project>(dummyProject)
    const { dispatch } = useContext(projectContext)
    const [disabled, setDisabled] = useState(false)
    const [stage, setStage] = useState(0)
    const stageMap = [
        {
            name: 'Тип проекта',
            jsx: <ProjectsSelectTemplate />
        },
        {
            name: 'Описание',
            jsx: <ProjectsDescription />
        },
        {
            name: 'Установка',
            jsx: <ProjectsInstall />
        },
        {
            name: 'GitHub',
            jsx: <ProjectsGithub />
        }
    ]
    function onClick() {
        if (stage == 3) {
            dispatch({ type: 'home' })
            return
        }
        setStage(stage + 1)
    }
    return (
        <>
            <HeaderPath path={`Создание проекта / ${stageMap[stage].name}`} />
            <div className='bg-zinc-500 flex flex-col h-[calc(100%-28px)] items-center justify-center overflow-scroll'>
                <div className='w-full h-full flex justify-center items-center'>
                    <projectCreateContext.Provider value={{ projectCreate, setProjectCreate, setDisabled }}>
                        {stageMap[stage].jsx}
                    </projectCreateContext.Provider>
                </div>
            </div>
            <div className='bg-zinc-500/80 h-[60px] px-20 flex items-center drop-shadow-md'>
                <Button w={200} onClick={() => setStage(stage - 1)} disabled={stage == 0 || stage > 1}>{'<- Назад'}</Button>
                <div className='grow'></div>
                <Button w={200} onClick={onClick} disabled={disabled}>{stage == 3 ? 'Завершить' : 'Далее ->'}</Button>
            </div>
        </>
    )

}

