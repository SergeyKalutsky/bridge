import { ipcRenderer } from 'electron';
import { useState } from 'react'
import '../assets/css/LoginPage.css'

type InputForms = {
    login: string
    password: string
}

type User = {
    error?: string
    api_key?: string
    name?: string
    id?: number
    password?: string
    login?: string
}


const LoginPage = (): JSX.Element => {
    const [loginData, setloginData] = useState<InputForms>({ login: '', password: '' })
    const handleData = (data: User) => {
        ipcRenderer.send('user-settings-set-request', data);
        window.location.reload()
    }
    return (
        <div className='content'>
            <div className='greetings'>
                Добро пожаловать в Bridge
            </div>
            <div className='input-forms'>
                <input type="text" placeholder='login'
                    onChange={(e) => { setloginData({ ...loginData, login: e.target.value }) }} />
                <input type="password" placeholder='password'
                    onChange={(e) => { setloginData({ ...loginData, password: e.target.value }) }} />
                <button
                onClick={()=> {
                    fetch('http://localhost:8000/users/auth',
                    {
                        method:'POST',
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
