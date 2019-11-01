import React, { Component } from 'react';
import SignOut from '../component/SignOut';
class Dashboard extends Component {

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