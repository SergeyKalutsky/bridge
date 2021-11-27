import { hot } from 'react-hot-loader';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import SideNavBar from './components/SideNavBar'
import LoginPage from './components/LoginPage';
import Git from './components/git/Git'
import { Projects } from './components/projects/Projects'
import './assets/css/base.css'
import { ipcRenderer } from 'electron';
import { useEffect, useState, createContext } from 'react';


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



const SettingsContext = createContext(null)

const AppContent = (): JSX.Element => {

  return (
    <Router>
      <SideNavBar />
      <Switch>
        <Route exact path="/" component={Projects} />
        <Route exact path="/git" component={Git} />
      </Switch>
    </Router>
  )
}



export default hot(module)(function App() {
  // Get stored settings on each change
  const [settings, setSettings] = useState<Settings>(ipcRenderer.sendSync('user-settings', { cmd: 'get' }))
  const [islogin, setIslogin] = useState(false)
  const [userSettingsLoaded, setUserSettingLoaded] = useState(false)

  useEffect(() => {
    // Resave settings on each change
    ipcRenderer.send('user-settings', { cmd: 'set', settings: settings })

    'user' in settings ? setIslogin(false) : setIslogin(true)
    setUserSettingLoaded(true)
  }, [settings])
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {userSettingsLoaded == true ? islogin == false ? <AppContent /> : <LoginPage /> : null}
    </SettingsContext.Provider>
  )
});

export { SettingsContext }