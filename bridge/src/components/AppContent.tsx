import { HashRouter as Router, Switch, Route } from "react-router-dom";
import SideNavBar from './SideNavBar'
import { Git } from './git/Git'
import { Projects } from './projects/Projects'
import Editor from './Editor/AceEditor'

const AppContent = (): JSX.Element => {

    return (
        <Router>
            <SideNavBar />
            <Switch>
                <Route exact path="/" component={Projects} />
                <Route exact path="/editor" component={Editor} />
                <Route exact path="/git" component={Git} />
            </Switch>
        </Router>
    )
}

export default AppContent