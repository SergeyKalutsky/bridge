import { InputForm, ErrorMessage, WarningMessage, LoadingMessage, LinkText, Button, SuccessMessage } from '../../common'
import { useState, useEffect, useContext } from 'react'
import { HeaderPath } from '../create/HeaderPath'
import { BackButton } from '../../common/BackButton'
import { projectContext } from '../Projects'

export function ProjectsGithubAdd({ setAddGitHub }:
    {
        setAddGitHub: React.Dispatch<React.SetStateAction<boolean>>
    }): JSX.Element {
    const { updateProject, userProjects } = useContext(projectContext)
    const [isButton, setIsButton] = useState(true)
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
            updateProject({
                projectName: userProjects.activeProject.name,
                newProject: {
                    ...userProjects.activeProject,
                    token: inputData.token,
                    http: inputData.remote
                }
            })
            setIsButton(false)
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
        window.projects.addGitHubRemote({ token: inputData.token, repo: userProjects.activeProject.name, url: inputData.remote })
    }
    function onBackClick() {
        setAddGitHub(false)
    }
    return (
        <div className="w-full h-full bg-zinc-500 ">
            <HeaderPath path='Добавить GitHub аккаунт' />
            <BackButton onClick={onBackClick} />
            <div className='flex flex-col h-[calc(100%-148px)] items-center justify-center overflow-scroll'>
                <div className=' w-3/5 h-3/5 max-w-xl flex-col justify-center items-center'>
                    <div className='w-full bg-teal-200/60 flex flex-col justify-center items-start mb-8 rounded-lg pt-3 pb-3 pr-3 pl-3 text-xl'>
                        <p className='pl-2'>Вам потребуется <span className='font-bold'>github аккаунт</span> и <LinkText text='fain-grain-token' />.</p>
                    </div>
                    <div className='flex flex-col justify-center items-center '>
                        <InputForm
                            onChange={(e) => { setInputData({ ...inputData, remote: e.target.value }) }}
                            placeholder='GitHub репо url'
                            type='text'
                            classInput='border-none pl-5 pt-3 pb-3 pr-3 text-xl'
                            classDiv='mb-5' >
                        </InputForm>
                        <InputForm
                            onChange={(e) => { setInputData({ ...inputData, token: e.target.value }) }}
                            placeholder='Token'
                            type='password'
                            classInput='border-none pl-5 pt-3 pb-3 pr-3 text-xl text-security-disc' >
                        </InputForm>
                        <div className='w-[120px] h-[40px] mt-8'>
                            {isButton ? <Button btnText='Добавить' onClick={onClick} /> : null}
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