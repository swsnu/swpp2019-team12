import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';

// User Container
import SignIn from './container/user/signin';
import SignUp from './container/user/signup';
import Account from './container/user/account';

// Workspace Container
import Workspace from './container/workspace/workspace';
import WorkspaceSelection from './container/workspace/WorkspaceSelection';

// Note Container
import Note from './container/note/note';

// Not Found Component
import NotFound from './component/not-found';

function App() {
    return (
        <Router>
            <Switch>
                {/* Can access without login */}
                <Route exact path="/">
                    <SignIn />
                </Route>
                <Route exact path="/signin">
                    <SignIn />
                </Route>
                <Route exact path="/signup">
                    <SignUp />
                </Route>
                {/* Cannot access without login */}
                <Route exact path="/account">
                    <Account />
                </Route>
                <Route exact path="/workspace" component={WorkspaceSelection} />
                <Route
                    exact
                    path="/:workspace_name/:w_id"
                    component={Workspace}
                />
                <Route exact path="/:workspace_name/:w_id/note/:n_id">
                    <Note />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
