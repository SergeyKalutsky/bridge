import { projectCreateContext } from './ProjectsCreate'
import { InputForm, ErrorMessage, WarningMessage, LoadingMessage, LinkText, Button } from '../../../components/common'
import { useState, useEffect, useContext } from 'react'



export function ProjectsGithub(): JSX.Element {
    const { projectCreate, setDisabled } = useContext(projectCreateContext)
    const [messageJsx, setMessageJsx] = useState<JSX.Element>()
    const [inputData, setInputData] = useState<{ token: string, remote: string }>()

    useEffect(() => {
        if (inputData?.token?.includes('ghp')) {
            const msg = 'Похоже что вы используете классический токен. Ради безопасности вашего GitHub аккаунта настоятельно рекомендуем перейти на Fine-Grain Token'
            setMessageJsx(<WarningMessage text={msg} />)
        }
    }, [inputData])

    useEffect(() => {
        window.shared.incomingData("projects:checkgithubproject", async ({ type, msg, token }) => {
            if (type === 'error') {
                setMessageJsx(<ErrorMessage text={msg} classDiv='mt-8 pt-2 pb-2 pr-2 pl-2' />)
            }
        })
        return () => window.shared.removeListeners('projects:checkgithubproject')
    }, [])
    
    const onClick = () => {
        if (!inputData.remote.includes('https')) {
            setMessageJsx(<ErrorMessage text={'Некорректный URL GitHub репо'} />)
            return
        }
        setMessageJsx(<LoadingMessage text='Добавляем удаленный сервер' />)
        // window.projects.addGitHubRemote({ token: inputData.token, repo: projectCreate.name, url: inputData.remote })
    }
    return (<>
        <div className='w-full bg-teal-200/60 flex flex-col justify-center items-start mb-8 rounded-lg pt-2 pb-2 pr-2 pl-2'>
            <p className='pl-2'>Этот шаг <span className='font-bold'>необязателен</span>.</p>
            <p className='pl-2'>Вам потребуется <span className='font-bold'>github аккаунт</span> и <LinkText text='fain-grain-token' />.</p>
        </div>
        <div className='flex flex-col justify-center items-center '>
            <InputForm
                onChange={(e) => { setInputData({ ...inputData, remote: e.target.value }) }}
                placeholder='GitHub репо url'
                type='text'
                classInput='border-none pl-5 text-xl'
                classDiv='mb-5' >
            </InputForm>
            <InputForm
                onChange={(e) => { setInputData({ ...inputData, token: e.target.value }) }}
                placeholder='Token'
                type='password'
                classInput='border-none pl-5 text-xl text-security-disc' >
            </InputForm>
            <div className='w-[120px] h-[40px] mt-8'>
                <Button btnText='Добавить' onClick={onClick} />
            </div>
        </div>
        <div className='h-[60px] w-full'>
            {messageJsx}
        </div>
    </>)
}