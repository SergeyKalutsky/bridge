import { hot } from 'react-hot-loader';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import SideNavBar from './components/SideNavBar'
import LoginPage from './components/LoginPage';
import Git from './components/git/Git'
import { Projects } from './components/projects/Projects'
import './assets/css/base.css'
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';


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
  const [islogin, setIslogin] = useState(false)
  const [userSettingsLoaded, setUserSettingLoaded] = useState(false)
  useEffect(() => {
    const settings = ipcRenderer.sendSync('user-settings', { cmd: 'get' })
    if (!('user' in settings)) {
      setIslogin(true)
    } else {
      window.sessionStorage.setItem('settings', JSON.stringify(settings))
    }
    setUserSettingLoaded(true)
  }, [])

  return (
    <>
      {userSettingsLoaded == true ? islogin == false ? <AppContent /> : <LoginPage /> : null}
    </>
  )
});