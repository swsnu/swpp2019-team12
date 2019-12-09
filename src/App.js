import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import 'antd/dist/antd.css';

// User Container
import SignIn from './container/user/SignIn';
import SignUp from './container/user/SignUp';

// Workspace Container
import Workspace from './container/workspace/Workspace';
import WorkspaceSelection from './container/workspace/WorkspaceSelection';

// Note Container
import Note from './container/note/Note';

// Not Found Component
import NotFound from './component/NotFound';

// Google STT
// import googleSTT from './container/stt/googleSTT';
// Editor

import CalendarBlock from './component/blocks/Calendar';

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
                    <Route exact path="/note/:n_id" component={Note} />
                    <Route
                        exact
                        path="/workspace"
                        component={WorkspaceSelection}
                    />
                    <Route
                        exact
                        path="/:workspace_name/:w_id"
                        component={Workspace}
                    />
                    <Route
                        exact
                        path="/:workspace_name/:w_id/note/:n_id"
                        component={Note}
                    />
                    <Route
                        exact
                        path="/calendar-test"
                        component={CalendarBlock}
                    />
                    <Route exact path="/googleSTT" component={googleSTT} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
