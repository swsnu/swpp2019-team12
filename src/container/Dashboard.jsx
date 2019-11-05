import React, { Component } from 'react';
import SignOut from '../component/SignOut';
import axios from 'axios'
class Dashboard extends Component {
    render() {
        axios.get('/api/workspace/1')
            .then(res => {
                            console.log(res.data)
                            console.log(res.data['members'])
                        })

        return (
            <div className="Dashboard">
                <h1>Dashboard</h1>
                <SignOut history={this.props.history} />
            </div>
        );
    }
}

export default Dashboard;
