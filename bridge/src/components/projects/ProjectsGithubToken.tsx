import { InputForm, ErrorMessage, WarningMessage, LoadingMessage, LinkText, Button, SuccessMessage } from '../common'
import { useState, useEffect, useContext } from 'react'
import { projectContext } from './Projects'
import { Project } from './types'
import { HeaderPath } from './create/HeaderPath'
import { BackButton } from './BackButton'

export function ProjectsGithubToken({ project, setChangeGitHubToken, setNewProject }:
    {
        project: Project,
        setChangeGitHubToken: React.Dispatch<React.SetStateAction<boolean>>
        setNewProject: React.Dispatch<React.SetStateAction<Project>>
    }): JSX.Element {
    const { updateProject } = useContext(projectContext)
    const [messageJsx, setMessageJsx] = useState<JSX.Element>()
    const [inputData, setInputData] = useState<{ token: string, remote: string }>({ token: '', remote: '' })

    useEffect(() => {
        if (inputData?.token?.includes('ghp')) {
            const msg = 'Похоже что вы используете классический токен. Ради безопасности вашего GitHub аккаунта настоятельно рекомендуем перейти на Fine-Grain Token'
            setMessageJsx(<WarningMessage text={msg} />)
        }
    }, [inputData])

    useEffect(() => {
        if (messageJsx?.props?.text === 'Удаленный сервер добавлен успешно') {
            updateProject({ projectName: project.name, newProject: { ...project, http: inputData.remote } })
            setNewProject({ ...project, http: inputData.remote })
            setChangeGitHubToken(false)
        }
    }, [messageJsx])

    useEffect(() => {
        window.shared.incomingData("projects:pushremote", async ({ type, msg }) => {
            if (type === 'error') {
                setMessageJsx(<ErrorMessage text={msg} classDiv='mt-8 pt-2 pb-2 pr-2 pl-2' />)
                return
            }
            setMessageJsx(<SuccessMessage text={'Удаленный сервер добавлен успешно'} />)
        })
        return () => window.shared.removeListeners('projects:pushremote')
    }, [])

    const onClick = () => {
        if (!inputData?.remote || !inputData.token) {
            setMessageJsx(<ErrorMessage text={'Все поля должны быть заполнены'} classDiv='mt-8 pt-2 pb-2 pr-2 pl-2' />)
            return
        }
        if (!inputData.remote.includes('https')) {
            setMessageJsx(<ErrorMessage text={'Некорректный URL GitHub репо'} classDiv='mt-8 pt-2 pb-2 pr-2 pl-2' />)
            return
        }
        setMessageJsx(<LoadingMessage text='Добавляем удаленный сервер' />)
        window.projects.addGitHubRemote({ token: inputData.token, repo: project.name, url: inputData.remote })
    }
    function onBackClick() {
        setChangeGitHubToken(false)
    }
    return (
        <div className="w-full h-full bg-zinc-500 ">
            <HeaderPath path='Изменить GitHub токен' />
            <BackButton onClick={onBackClick} />
            <div className='flex flex-col h-[calc(100%-148px)] items-center justify-center overflow-scroll'>
                <div className=' w-3/5 h-3/5 max-w-xl flex-col justify-center items-center'>
                    <div className='flex flex-col justify-center items-center '>
                    <InputForm
                            disabled={true}
                            value={project.http}
                            placeholder='GitHub репо url'
                            type='text'
                            classInput='border-none pl-5 pt-3 pb-3 pr-3 text-xl bg-zinc-300 hover:cursor-not-allowed'
                            classDiv='mb-5 hover:cursor-not-allowed bg-zinc-300'  >
                        </InputForm>
                        <InputForm
                            onChange={(e) => { setInputData({ ...inputData, token: e.target.value }) }}
                            placeholder='Новый Token'
                            type='password'
                            classInput='border-none pl-5 pt-3 pb-3 pr-3 text-xl text-security-disc' >
                        </InputForm>
                        <div className='w-[120px] h-[40px] mt-8'>
                            <Button btnText='Изменить' onClick={onClick} />
                        </div>
                    </div>
                    <div className='h-[100px] w-full mt-4'>
                        {messageJsx}
                    </div>
                </div>
            </div>
        </div>
    )
}