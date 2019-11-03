import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';

// User Container
import SignIn from './container/user/SignIn';
import SignUp from './container/user/SignUp';
import Account from './container/user/Account';

// Workspace Container
import Workspace from './container/workspace/Workspace';

// Note Container
import Note from './container/note/Note';

// Not Found Component
import NotFound from './component/NotFound';
import Dashboard from './container/Dashboard';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    {/* Can access without login */}
                    <Route exact path="/" component={SignIn} />
                    <Route exact path="/signin" component={SignIn} />
                    <Route exact path="/signup" component={SignUp} />
                    {/* Cannot access without login */}
                    <Route exact path="/note" component={Note} />
                    <Route exact path="/account" component={Account} />
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route
                        exact
                        path="/:workspace_name/:w_id/note"
                        component={Workspace}
                    />
                    <Route
                        exact
                        path="/:workspace_name/:w_id/note/:n_id"
                        component={Note}
                    />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
