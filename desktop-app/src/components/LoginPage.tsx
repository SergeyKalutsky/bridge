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
        ipcRenderer.send('user-settings-set-request', {'user': data});
        window.location.reload()
    }
    return (
        <div className='content'>
            <div className='greetings'>
                Добро пожаловать!
            </div>
            <div className='input-forms'>
                <div className='inputContainer'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#515151" fill="none" strokeLinecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="7" r="4" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                    <input type="text" placeholder=' Логин'
                        onChange={(e) => { setloginData({ ...loginData, login: e.target.value }) }} />
                </div>
                <div className='inputContainer'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-key" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#515151" fill="none" strokeLinecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="8" cy="15" r="4" />
                        <line x1="10.85" y1="12.15" x2="19" y2="4" />
                        <line x1="18" y1="5" x2="20" y2="7" />
                        <line x1="15" y1="8" x2="17" y2="10" />
                    </svg>
                    <input type="password" placeholder=' Пароль'
                        onChange={(e) => { setloginData({ ...loginData, password: e.target.value }) }} />
                </div>
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
