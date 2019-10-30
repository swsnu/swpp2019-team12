import React, { Component } from 'react';
import OverviewBlock from '../component/OverviewBlock';
import Logout from '../component/Logout';
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
                <OverviewBlock elems={this.state.current_agenads}/>
                <Logout history={this.props.history}/>
            </div>
        );
    }
}

export default Dashboard;