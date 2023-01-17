import { projectCreateContext } from './ProjectsCreate'
import { InputForm, ErrorMessage, WarningMessage, LoadingMessage, LinkText, Button } from '../../../components/common'
import { useState, useEffect, useContext } from 'react'
import { BsCheckLg } from 'react-icons/bs'



export function ProjectsGithub(): JSX.Element {
    const { projectCreate, setDisabled } = useContext(projectCreateContext)
    const [messageJsx, setMessageJsx] = useState<JSX.Element>()
    const [showCheckMark, setShowCheckMark] = useState<boolean>(false)
    useEffect(() => {
        window.shared.incomingData("projects:checkgithubproject", async ({ type, msg, token }) => {
            if (type === 'error') {
                setMessageJsx(<ErrorMessage text={msg} classDiv='mt-8 pt-2 pb-2 pr-2 pl-2' />)
            } else {
                if (!token.includes('github_pat')) {
                    const msg = 'Похоже что вы используете классический токен. Ради безопасности вашего GitHub аккаунта настоятельно рекомендуем перейти на Fine-Grain Token'
                    setMessageJsx(<WarningMessage text={msg} />)
                } else {
                    setMessageJsx(null)
                }
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
        window.projects.checkGitHubToken({ token: e.target.value, repo: projectCreate.name })

    }
    return (<>
        <div className='w-full bg-teal-200/60 flex flex-col justify-center items-start mb-8 rounded-lg pt-2 pb-2 pr-2 pl-2'>
            <p className='pl-2'>Этот шаг <span className='font-bold'>необязателен</span>.</p>
            <p className='pl-2'>Вам потребуется <span className='font-bold'>github аккаунт</span> и <span className='font-bold'>токен</span> (<LinkText text='fain-grain-token' />).</p>
        </div>
        <div className='flex-row justify-center items-center '>
            <InputForm
                // handleKeyPress={handleKeyPress}
                // onChange={onChange}
                placeholder='GitHub репо url'
                type='text'
                classInput='border-none pl-5 text-xl'
                classDiv='mb-5' >
                {showCheckMark ? <BsCheckLg style={{ color: '#08d120', width: 36, height: 36, paddingLeft: 8, backgroundColor: '#fafafa' }} /> : null}
            </InputForm>
            <InputForm
                handleKeyPress={handleKeyPress}
                onChange={onChange}
                placeholder='Token'
                type='password'
                classInput='border-none pl-5 text-xl text-security-disc' >
                {showCheckMark ? <BsCheckLg style={{ color: '#08d120', width: 36, height: 36, paddingLeft: 8, backgroundColor: '#fafafa' }} /> : null}
            </InputForm>
            <div>
                <Button />
            </div>
        </div>
        {messageJsx}
    </>)
}