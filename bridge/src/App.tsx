import { useEffect, useState } from 'react';
import InitInstaller from './InitInstaller'
import LoginPage from './components/login/LoginPage';
import AppContent from './components/AppContent'
import './assets/index.css'


export default function App(): JSX.Element {
    const [islogin, setIslogin] = useState(false)
    const [userSettingsLoaded, setUserSettingLoaded] = useState(false)

    useEffect(() => {
        const settings = window.settings.get()
        setUserSettingLoaded(true)
        'user' in settings ? setIslogin(false) : setIslogin(true)
    }, [])

    return (
        <InitInstaller />
        // <>
        //     {userSettingsLoaded == true ? islogin == false ? <AppContent /> : <LoginPage setIslogin={setIslogin} /> : null}
        // </>
    )
}
