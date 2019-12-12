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

    handleSignIn = e => {
        e.preventDefault();
        const user_info = {
            username: this.state.email,
            password: this.state.password
        };

        axios
            .post('/api/signin/', user_info)
            .then(res => {
                const nickname = res.data.nickname;
                const userId = res.data.id;
                sessionStorage.setItem('LoggedInUserNickname', nickname);
                sessionStorage.setItem('LoggedInUserId', userId);
                this.props.history.push('/workspace');
            })
            .catch(err => {
                this.setState({
                    submitText:
                        '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.'
                });
            });
    };

    handleNavigateSignUp = e => {
        e.preventDefault();
        this.props.history.push('/signup');
    };

    render() {
        return (
            <div className="SignIn">
                <h1>Signin Page</h1>
                <form>
                    <p>User Email *</p>
                    <input
                        id="email-input"
                        placeholder="email"
                        onChange={e => this.setState({ email: e.target.value })}
                        value={this.state.email}
                    />
                    <br />
                    <p>Password *</p>
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
                            Sign In
                        </button>
                        <div className="signup_invitation">
                            <p> Want to Sign Up? </p>
                            <a
                                // className="primary"
                                id="navigate_sign_up_button"
                                onClick={this.handleNavigateSignUp}>
                                Sign Up Here
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignIn;
