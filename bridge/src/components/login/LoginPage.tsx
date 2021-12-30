import { useState } from 'react'
import { authUser } from '../../lib/api/gitlab/index'
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
    const onUserInputChange = e => {
        setloginData({ ...loginData, login: e.target.value })
    };
    const onPasswordInputChange = e => {
        setloginData({ ...loginData, password: e.target.value })
    };
    const sendAuthUser = () => {
        authUser(loginData)
            .then(response => response.json())
            .then(data => handleData(data))
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
                    <Button btnText='Вход' onClick={sendAuthUser} />
                </div>
            </div>
        </div>
    )

}


export default LoginPage
