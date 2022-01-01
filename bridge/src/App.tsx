import { useEffect, useState } from 'react';
import InitInstaller from './InitInstaller'
import LoginPage from './components/login/LoginPage';
import AppContent from './components/AppContent'
import './assets/index.css'


export default function App(): JSX.Element {
    const [islogin, setIslogin] = useState(false)
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [userSettingsLoaded, setUserSettingLoaded] = useState(false)
    const [content, setContent] = useState<JSX.Element>(null)

    useEffect(() => {
        const settings = window.settings.get()
        setUserSettingLoaded(true)
        'user' in settings ? setIslogin(false) : setIslogin(true)
    }, [])

    useEffect(() => {
        if (userSettingsLoaded) {
            if (isFirstLoad) {
                setContent(<InitInstaller setIsFirstLoad={setIsFirstLoad} />)
                return
            }
            if (islogin) {
                setContent(<LoginPage setIslogin={setIslogin} />)
                return
            }
            setContent(<AppContent />)
        }
    }, [userSettingsLoaded, isFirstLoad, islogin])
    
    return <>{content}</>
}
