import { useEffect, useState } from 'react';
import LoginPage from './components/login/LoginPage';
import './assets/css/base.css'

interface Settings {
    user?: {
        name?: string
        login?: string
        password?: string
        'X-API-Key'?: string
    }
    active_project?: {
        id: number
        name: string
        isclassroom: number
        isuserowner: number
    }
}

declare global {
    interface Window {
        settings: {
            set(settings: any): Promise<any>;
            get(): any
        },
        projects: {
            mkbasedir(data: any): Promise<any>
        }
    }
}



export default function App(): JSX.Element {
    const [settings, setSettings] = useState<Settings>({})
    const [islogin, setIslogin] = useState(false)
    const [userSettingsLoaded, setUserSettingLoaded] = useState(false)


    useEffect(() => {
        // Resave settings on each change
        window.settings.get()
            .then(settings => {
                setSettings(settings);
                setUserSettingLoaded(true);
                'user' in settings ? setIslogin(false) : setIslogin(true)
            })
    }, [])

    return (
        <>
            {userSettingsLoaded == true ? islogin == false ? null : <LoginPage /> : null}
        </>
    )
}
