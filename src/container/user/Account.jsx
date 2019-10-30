import React, { Component } from 'react';
import axios from 'axios'
import Logout from '../../component/Logout';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken"

class Account extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        axios.get('/api/test')
            .then(res => console.log(res))
        return (<div>
                    <h1>account page</h1>
                    <Logout history={this.props.history}/> 
                </div>);
    }
}

export default Account;
