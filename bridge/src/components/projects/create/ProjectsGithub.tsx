import { LoadingIcon } from '../../../components/common/Icons'
import { InputForm } from '../../../components/common'
import { createProjectProp } from './types'
import { useState, useEffect } from 'react'
import { BsCheckLg } from 'react-icons/bs'


function LinkText({ text }: { text: string }): JSX.Element {
    return <span className='font-semibold text-blue-600 underline hover:underline-offset-1 hover:cursor-pointer'>{text}</span>
}

function ErrorMessage({ text }: { text: string }): JSX.Element {
    return (
        <div className='w-full bg-rose-400/70 flex justify-start items-center mt-8 rounded-lg pt-2 pb-2 pr-2 pl-2'>
            <p className='font-medium pl-2'>{'🛑'}</p>
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}

function WarningMessage({ text }: { text: string }): JSX.Element {
    return (
        <div className='w-full bg-orange-600/95 flex justify-start items-center mt-8 rounded-lg pt-2 pb-2 pr-2 pl-2'>
            <p className='font-medium text-slate-100 pl-2'>{'⚠️' + text}</p>
        </div>
    )
}

function LoadingMessage({ text }: { text: string }): JSX.Element {
    return (
        <div className='text-xl  w-full flex justify-start items-center mt-3 pt-2 pb-2 pr-2 pl-2'>
            <LoadingIcon />
            <p className='font-medium text-slate-100 pl-2'>{text}</p>
        </div>
    )
}

export function ProjectsGithub({ projectCreate, setProjectCreate, setDisabled }: createProjectProp): JSX.Element {
    const [messageJsx, setMessageJsx] = useState<JSX.Element>()
    const [showCheckMark, setShowCheckMark] = useState<boolean>(false)
    useEffect(() => {
        window.shared.incomingData("projects:checkgithubproject", async ({ type, msg }) => {
            if (type === 'error') {
                setMessageJsx(<ErrorMessage text={msg} />)
            } else if (type === 'warning') {
                setMessageJsx(<WarningMessage text={msg} />)
                setShowCheckMark(true)
                setDisabled(false)
            } else {
                setMessageJsx(null)
                setShowCheckMark(true)
                setDisabled(false)
            }
        })
        return () => window.shared.removeListeners('projects:checkgithubproject')
    }, [])
    const handleKeyPress = async (event) => {
        if (event.key === 'Backspace') {
            event.target.value = ''
            setDisabled(false)
            setMessageJsx(null)
            setShowCheckMark(false)
        }
    }
    const onChange = (e) => {

        if (e.target.value === '') {
            setDisabled(false)
            setMessageJsx(null)
            return
        }
        setDisabled(true)
        setMessageJsx(<LoadingMessage text='Проверка токена' />)
        window.projects.checkGitHubToken({ token: e.target.value, name: projectCreate.name })

    }
    return (<>
        <div className='w-full bg-teal-200/60 flex flex-col justify-center items-start mb-8 rounded-lg pt-2 pb-2 pr-2 pl-2'>
            <p className='pl-2'>Этот шаг <span className='font-bold'>необязателен</span>.</p>
            <p className='pl-2'>Вам потребуется <span className='font-bold'>github аккаунт</span> и <span className='font-bold'>токен</span> (<LinkText text='classic' /> или <LinkText text='fain-grain' />).</p>
        </div>
        <div className='flex justify-center items-center '>
            <InputForm
                handleKeyPress={handleKeyPress}
                onChange={onChange}
                placeholder='GitHub token'
                type='password'
                classInput='border-none pl-5 text-2xl text-security-disc' >
                {showCheckMark ? <BsCheckLg style={{ color: '#08d120', width: 36, height: 36, paddingLeft: 8, backgroundColor: '#fafafa' }} /> : null}
            </InputForm>
        </div>
        {messageJsx}
    </>)
}