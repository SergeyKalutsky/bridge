import { useEffect, useState } from 'react';
import LoginPage from './components/login/LoginPage';
import AppContent from './components/AppContent'
import { Project } from './components/projects/Projects'
import './assets/css/base.css'

declare global {
    interface Window {
        settings: {
            set(settings: any): Promise<any>;
            get(): any
        },
        projects: {
            mkbasedir(data: any): Promise<any>
            getLocalProjectsNames(): string[]
            delete(name: string): void
        },
        git: {
            clone(project: Project): void
        }
    }
}


export default function App(): JSX.Element {
    const [islogin, setIslogin] = useState(false)
    const [userSettingsLoaded, setUserSettingLoaded] = useState(false)

    useEffect(() => {
        const settings = window.settings.get()
        setUserSettingLoaded(true)
        'user' in settings ? setIslogin(false) : setIslogin(true)
    }, [])

    return (
        <>
            {userSettingsLoaded == true ? islogin == false ? <AppContent /> : <LoginPage setIslogin={setIslogin} /> : null}
        </>
    )
}
