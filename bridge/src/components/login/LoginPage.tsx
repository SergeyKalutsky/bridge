import { useState } from 'react'
import { authUser } from '../../lib/api/index'
import { LogoIcon, UserIcon, KeyIcon } from '../Icons';
import '../../assets/css/LoginPage.css'

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


const LoginPage = (): JSX.Element => {
    const [loginData, setloginData] = useState<InputForms>({ login: '', password: '' })

    const handleData = (data: User) => {
        if (!('error' in data)) {
            data['password'] = loginData.password
            window.settings.set({ user: data })
        }
        window.projects.mkbasedir(data)
    }
    return (
        <div className='content'>
            <div className='greetings'>
                Добро пожаловать!
            </div>
            <div className='input-forms'>
                <LogoIcon />
                <div className='inputContainer'>
                    <UserIcon />
                    <input className='inLog' type="text" placeholder='Логин'
                        onChange={(e) => { setloginData({ ...loginData, login: e.target.value }) }} />
                </div>
                <div className='inputContainer'>
                    <KeyIcon />
                    <input className='inLog' type="password" placeholder='Пароль'
                        onChange={(e) => { setloginData({ ...loginData, password: e.target.value }) }} />
                </div>
                <button
                    onClick={() => {
                        authUser(loginData)
                            .then(response => response.json())
                            .then(data => handleData(data))
                    }}
                >Вход</button>
            </div>
        </div>
    )

}


export default LoginPage
