import { hot } from 'react-hot-loader';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import SideNavBar from './components/SideNavBar'
import Git from './components/git/Git'
import { Projects } from './components/projects/Projects'
import './assets/css/base.css'


export default hot(module)(function App() {

  return (
    <>
      <Router>
        <SideNavBar />
        <Switch>
          <Route exact path="/" component={Git} />
          <Route exact path="/projects" component={Projects} />
        </Switch>
      </Router>
    </>
  )
});