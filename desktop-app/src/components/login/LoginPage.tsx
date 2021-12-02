import { useContext, useState } from 'react'
import { SettingsContext } from '../../App';
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
    const { settings, setSettings } = useContext(SettingsContext)
    const [loginData, setloginData] = useState<InputForms>({ login: '', password: '' })

    const handleData = (data: User) => {
        if (!('error' in data)) {
            data['password'] = loginData.password
            setSettings({ user: data })
        }
    }
    return (
        <div className='content'>
            <div className='greetings'>
                Добро пожаловать!
            </div>
            <div className='input-forms'>
                <LogoIcon/>
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
                        fetch('http://localhost:8000/auth',
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(loginData)
                            })
                            .then(response => response.json())
                            .then(data => handleData(data))
                    }}
                >Вход</button>
            </div>
        </div>
    )

}


export default LoginPage
