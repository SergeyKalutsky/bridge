import { useEffect, useState } from 'react';
import LoginPage from './components/login/LoginPage';
import AppContent from './components/AppContent'
import { Project } from './components/projects/Projects'
import { Commit } from './components/git/Git';
import './assets/css/base.css'

type ParsedGitDiff = {
    filename: string
    oldFile: string
    newFile: string
}


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
            showFiles(): Promise<any>
            setActiveFile(filepath: string): string
        },
        git: {
            clone(project: Project): void
            pull(): void
            push(): void
            log(): Commit[]
            diff(hash: string): ParsedGitDiff[]
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
