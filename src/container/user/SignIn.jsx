import React, { Component } from 'react';
import axios from 'axios'

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken"
class SignIn extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        email: "",
        password: "",
        
        submitText: "",
        submitted: false
    }

    componentDidMount() {}

    handleSignin = (e) => {
        e.preventDefault()
        const user_info = {
            username: this.state.email,
            password: this.state.password
        }

        axios.post('/api/signin/', user_info)
                .then(res => {
                    this.props.history.push('/dashboard')})
                .catch(res => console.log("err"))
    }
    
    render() {
        return (
                <div className="Signin">
                    <h1>Signin Page</h1>
                    <form>
                        <input 
                            id="email-input"
                            placeholder="email"
                            onChange={(e) => this.setState({ email: e.target.value })}
                            value={this.state.email}
                        />
                        <br/>
                        <input 
                            id="password-input"
                            placeholder="password"
                            onChange={(e) => this.setState({ password: e.target.value })}
                            value={this.state.password}
                        />
                        <br/>
                        <br/>
                        <p>{this.state.submitText}</p>
                        <button
                            id="signin-button"
                            onClick={this.handleSignin}
                        >
                            Signin
                        </button>
                    </form>
                </div>);
    }
}

export default SignIn;
