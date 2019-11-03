import React, { Component } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',

            submitText: '',
            submitted: false
        };
    }

    componentDidMount() {}

    handleSignIn = e => {
        e.preventDefault();
        const user_info = {
            username: this.state.email,
            password: this.state.password
        };

        axios
            .post('/api/signin/', user_info)
            .then(res => {
                this.props.history.push('/workspace');
            })
            .catch(res => console.log('err'));
    };

    handleNavigateSignUp = e => {
        e.preventDefault();
        this.props.history.push('/signup');
    };

    render() {
        return (
            <div className="Signin">
                <h1>Signin Page</h1>
                <form>
                    <input
                        id="email-input"
                        placeholder="email"
                        onChange={e => this.setState({ email: e.target.value })}
                        value={this.state.email}
                    />
                    <br />
                    <input
                        id="password-input"
                        placeholder="password"
                        onChange={e =>
                            this.setState({ password: e.target.value })
                        }
                        value={this.state.password}
                    />
                    <br />
                    <br />
                    <p>{this.state.submitText}</p>
                    <div className="button-container">
                        <button
                            className="primary"
                            id="sign_in_button"
                            onClick={this.handleSignIn}>
                            Signin
                        </button>
                        <button
                            className="primary"
                            id="navigate_sign_up_button"
                            onClick={this.handleNavigateSignUp}>
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignIn;
