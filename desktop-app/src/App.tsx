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
        <Route exact path="/" component={Git} />
        <Route exact path="/projects" component={Projects} />
      </Switch>
    </Router>
  )
}

export default hot(module)(function App() {
  const [islogin, setIslogin] = useState(false)
  useEffect(() => {
    ipcRenderer.send('user-settings-get-request', 'ping')
  })

  ipcRenderer.once('user-settings-get-response', (event, arg) => {
    if (!('user' in arg)) {
      setIslogin(true)
    } else {
      window.sessionStorage.setItem('settings', JSON.stringify(arg))
    }
  })
  return (
    <>
      {islogin == false ? <AppContent /> : <LoginPage />}
    </>
  )
});