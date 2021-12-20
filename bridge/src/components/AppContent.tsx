import { HashRouter as Router, Switch, Route } from "react-router-dom";
import SideNavBar from './SideNavBar'
import { Git } from './git/Git'
import { Projects } from './projects/Projects'
import Editor from './Editor/Editor'

const AppContent = (): JSX.Element => {

    return (
        <div className="flex h-full">
            <Router>
                <SideNavBar />
                <Switch>
                    <Route exact path="/" component={Projects} />
                    <Route exact path="/editor" component={Editor} />
                    <Route exact path="/git" component={Git} />
                </Switch>
            </Router>
        </div>
    )
}

export default AppContent