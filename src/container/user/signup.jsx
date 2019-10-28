import React, { Component } from 'react';
import SignUpForm from '../../component/SignupForm/SignupForm';
class SignUp extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (<div>
                    <h1>sign up page</h1>
                    <SignUpForm/>
                </div>);
    }
}

export default SignUp;
