import { useEffect, useState, createContext } from 'react';
import AppContent from './components/AppContent'
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
            set(): any;
            get(): any
        }
    }
}

const SettingsContext = createContext(null)


export default  function App(): JSX.Element {
    // Get stored settings on each change
    const defaultSettings = window.settings.get()
    const [settings, setSettings] = useState<Settings>(defaultSettings)
    console.log(settings)
    const [islogin, setIslogin] = useState(false)
    const [userSettingsLoaded, setUserSettingLoaded] = useState(false)

    // useEffect(() => {
    //     // Resave settings on each change
    //     ipcRenderer.send('user-settings', { cmd: 'set', settings: settings })

    //     'user' in settings ? setIslogin(false) : setIslogin(true)
    //     setUserSettingLoaded(true)
    // }, [settings])
    
    return (
        <>defaultSettings</>
        // <SettingsContext.Provider value={{ settings, setSettings }}>
        //     {userSettingsLoaded == true ? islogin == false ? <AppContent /> : <LoginPage /> : null}
        // </SettingsContext.Provider>
    )
}

export { SettingsContext }