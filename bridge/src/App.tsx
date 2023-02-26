import { useEffect, useState } from 'react';
import LoginPage from './components/Login/LoginPage';
import AppContent from './components/AppContent'
import './assets/index.css'


export default function App(): JSX.Element {
    const [islogin, setIslogin] = useState(false)
    const [userSettingsLoaded, setUserSettingLoaded] = useState(false)
    const [content, setContent] = useState<JSX.Element>(null)

    useEffect(() => {
        const user = window.settings.get('user')
        setUserSettingLoaded(true)
        user !== undefined ? setIslogin(false) : setIslogin(true)
    }, [])

    useEffect(() => {
        if (userSettingsLoaded) {
            if (islogin) {
                setContent(<LoginPage setIslogin={setIslogin} />)
                return
            }
            setContent(<AppContent />)
        }
    }, [userSettingsLoaded, islogin])

    return <>{content}</>
}
