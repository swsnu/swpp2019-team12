import React, { Component } from 'react';
import SignOut from '../component/SignOut';
import Signout from '../component/signout/Signout';
import axios from 'axios';
class Dashboard extends Component {
    componentDidMount() {
        const loggedInUserNickname = sessionStorage.getItem(
            'LoggedInUserNickname'
        );
        if (!loggedInUserNickname) {
            this.props.history.push('/signin');
        }
    }

    render() {
        return (
            <div className="Dashboard">
                <Signout history={this.props.history} />
                <h1>Dashboard</h1>
            </div>
        );
    }
}

export default Dashboard;
