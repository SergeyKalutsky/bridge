import { hot } from 'react-hot-loader';
import {  HashRouter as Router, Switch, Route } from "react-router-dom";
import GitMenu from './components/git/GitMenu'
import SideNavBar from './components/SideNavBar'
import Workspace from './components/git/Workspace'
import Rooms from './components/rooms/Rooms'
import RoomsMenu from './components/rooms/RoomsMenu'
import './assets/css/base.css'

const Git = () => {
  return (
    <>
      <GitMenu />
      <Workspace />
    </>
  )
}

const Room = () => {
  return (
    <>
      <RoomsMenu />
      <Rooms />
    </>
  )
}

const Main = () => {
  return (
    <>
    <Router>
      <SideNavBar />  
      <Switch>
        <Route exact path="/" component={Git} />
        <Route exact path="/rooms" component={ Room } />
      </Switch>
    </Router>
    </>
  )
}


export default hot(module)(function App() {
  return (
    <Main />
  );
});