import { useState } from 'react'
import ImputForm from '../common/InputForm'
import Button from '../common/Button'
import { LogoIcon, UserIcon, KeyIcon } from '../common/Icons';


type InputForms = {
    login: string
    password: string
}

type User = {
    error?: string
    name?: string
    id?: number
    password?: string
    login?: string
}

interface Props {
    setIslogin: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginPage = ({ setIslogin }: Props): JSX.Element => {
    const [loginData, setloginData] = useState<InputForms>({ login: '', password: '' })

    const handleData = (data: User) => {
        if (!('error' in data)) {
            data['password'] = loginData.password
            window.settings.set({ user: data })
            setIslogin(false)
        }
        window.projects.mkbasedir(data)
    }
    const onUserInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setloginData({ ...loginData, login: e.target.value })
    };
    const onPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setloginData({ ...loginData, password: e.target.value })
    };
    const authGuest = (): void => {
        const data = { user: { type: 'guest', login: 'guest' } }
        window.settings.set(data)
        window.projects.mkbasedir(data.user)
        setIslogin(false)
    }
    return (
        <div className='flex justify-center items-center bg-stone-800 flex-col h-full'>
            <div className='text-7xl text-slate-100 font-sans mt-5'>
                Добро пожаловать!
            </div>
            <div className='flex flex-col items-center justify-center w-full h-full'>
                <LogoIcon />
                <div className='flex flex-col items-center justify-center h-2/4 w-1/4 gap-y-5'>
                    <ImputForm onChange={onUserInputChange} type='text' placeholder='Логин'>
                        <UserIcon />
                    </ImputForm>
                    <ImputForm onChange={onPasswordInputChange} type='password' placeholder='Пароль'>
                        <KeyIcon />
                    </ImputForm>
                    <Button btnText='Гость' onClick={authGuest} theme='teal' />
                </div>
            </div>
        </div>
    )

}


export default LoginPage
