import React, { Component } from 'react';
import SignOut from '../component/SignOut';
class Dashboard extends Component {
    state = {
        current_agenads : [
            {id: 1, title: "TEST"},
            {id: 2, title: "TEST2"}
        ]
    }
    render() {
        return (
            <div className="Dashboard">
                <h1>Dashboard</h1>
                <SignOut history={this.props.history}/>
            </div>
        );
    }
}

export default Dashboard;