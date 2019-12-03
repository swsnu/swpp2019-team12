import React, { Component } from 'react';
import Signout from '../component/signout/Signout';

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
