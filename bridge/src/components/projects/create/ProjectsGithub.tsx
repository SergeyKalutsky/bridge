import { InputForm } from '../../../components/common'
import { createProjectProp } from './types'

export function LinkText({ text }: { text: string }): JSX.Element {
    return <span className='font-semibold text-blue-600 underline hover:underline-offset-1 hover:cursor-pointer'>{text}</span>
}

export function ProjectsGithub({ projectCreate, setProjectCreate, setDisabled }: createProjectProp): JSX.Element {
    return (<>
        <div className='w-full bg-teal-200/60 flex flex-col justify-center items-start mb-8 rounded-lg pt-2 pb-2 pr-2 pl-2'>
            <p className='pl-2'>Этот шаг необязателен.</p>
            <p className='pl-2'>Вам потребуется <span className='font-bold'>github аккаунт</span> и <span className='font-bold'>токен</span> (<LinkText text='classic'/> или <LinkText text='fain-grain'/>).</p>
        </div>
        <InputForm
            placeholder='GitHub token'
            type='password'
            classInput='border-none pl-5' />

    </>)
}