import { InputForm, Button, Message } from '../../common'
import { useState, useEffect, useContext } from 'react'
import { HeaderPath } from '../create/HeaderPath'
import { BackButton } from '../../common/BackButton'
import { projectContext } from '../Projects'
import { Action, ProjectMenuState } from './ProjectMenu'

export function ProjectsGithubToken({ dispatch, state }:
    {
        dispatch: React.Dispatch<Action>
        state: ProjectMenuState
    }): JSX.Element {
    const { updateProject, userProjects } = useContext(projectContext)
    const [isButton, setIsButton] = useState(true)
    const [messageJsx, setMessageJsx] = useState<JSX.Element>(null)
    const [inputData, setInputData] = useState<{ token: string, remote: string }>({ token: '', remote: '' })

    useEffect(() => {
        if (inputData?.token?.includes('ghp')) {
            const msg = 'Похоже что вы используете классический токен. Ради безопасности вашего GitHub аккаунта настоятельно рекомендуем перейти на Fine-Grain Token'
            setMessageJsx(<Message type='warning' text={msg} />)
        }
    }, [inputData])

    useEffect(() => {
        if (messageJsx?.props?.text === 'Не удалось добавить токен.') {
            setIsButton(true)
            return
        }
        if (messageJsx?.props?.text === 'Токен обновлен') {
            dispatch({
                type: 'update',
                payload: {
                    ...state,
                    project: {
                        ...state.project,
                        token: inputData.token,
                    }
                }
            })
            updateProject({
                projectName: userProjects.activeProject.name,
                newProject: {
                    ...userProjects.activeProject,
                    token: inputData.token,
                }
            })
            setIsButton(false)
        }
    }, [messageJsx])

    useEffect(() => {
        window.shared.incomingData("projects:testtoken", async ({ type, msg }) => {
            if (type === 'error') {
                setMessageJsx(<Message type='error' text={msg} className='mt-8 pt-2 pb-2 pr-2 pl-2' />)
                return
            }
            setMessageJsx(<Message type='success' text={'Токен обновлен'} />)
        })
        return () => window.shared.removeListeners('projects:testtoken')
    }, [])

    const onClick = () => {
        setMessageJsx(<Message type='loading' text='Проверяем токен' />)
        window.projects.testGitHubToken({
            token: inputData.token,
            repo: userProjects.activeProject.name,
            git_url: userProjects.activeProject.http
        })
        setIsButton(false)
    }
    function onBackClick() {
        dispatch({ type: 'open', payload: { openChangeGitHubToken: false } })
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
                            value={userProjects.activeProject.http}
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
                        {isButton ?
                            <div className='w-[120px] h-[40px] mt-8'>
                                <Button btnText='Изменить' onClick={onClick} />
                            </div>
                            : null}
                    </div>
                    <div className='h-[100px] w-full mt-4'>
                        {messageJsx}
                    </div>
                </div>
            </div>
        </div>
    )
}