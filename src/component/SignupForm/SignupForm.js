import React, { Component } from 'react';
import axios from 'axios'

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken"

class SignUpForm extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        email: '',
        password: '',
        password_confirmation: '',
        nickname: '',
        isEmailVaild: false,
        isPwVaild: false,
        isPwConfirmationVaild: false,
        // isNicknameValid: false,
        emailVaildText: "",
        pwConfirmationVaildText: "",
        pwVaildText: "",
        submitted: false,
    }
    /*
    characters other than @ or whitespace followed by an @ sign, 
    followed by more characters (not \'@\', \'.\', or whitespace: co.kr is not allowed in this case), 
    and then a \".\". After the \".\", you can only write 2 to 3 letters from a to z.
    */
    checkEmail = () => {
        let isFormVaild = (/^[^@\s]+@[^@\s\.]+[.][a-zA-Z]{2,3}$/.test(this.state.email));

        if (!isFormVaild) {
            this.setState({ emailVaildText: "잘못된 형식입니다.", isEmailVaild: false })
        }
        else {
            axios.get('/api/signup/', {headers: {'INPUTID': this.state.email}})
                .then(res => {
                                console.log(res)
                                if(res['status'] == 200) {
                                    this.setState({ emailVaildText: "멋진 아이디네요!",
                                                    isEmailVaild: true    
                                                })
                                }
                                else {
                                    this.setState({ emailVaildText: "이미 동일한 아이디가 존재합니다.",
                                                    isEmailVaild: false    
                                                })
                                }
                            })
        }
    }
    /* 
    Must contain at least one number and one uppercase and one lowercase letter, 
    and at least 8 or more characters.
    */
    checkPassword = () => {
        let isFormVaild = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.state.password);
        if (isFormVaild) {
            this.setState({ isPwVaild: true,
                            pwVaildText: "",    
                        })
        }
        else {
            this.setState({ isPwVaild: false, 
                            pwVaildText: "Must contain at least one number and one uppercase and one lowercase letter \n \
                                        and at least 8 or more characters."
                        })
        }
    }

    checkPasswordConfirmation = () => {
        if (this.state.password === this.state.password_confirmation) {
            this.setState({ isPwConfirmationVaild: true, 
                            pwConfirmationVaildText: "",    
                        })
        }
        else {
            this.setState({ isPwConfirmationVaild: false, 
                            pwConfirmationVaildText: "비밀번호가 일치하지 않습니다."    
                        })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const user_info = {
            username: this.state.email,
            password: this.state.password,
        };
        let isAllFormValid = (
                    this.state.isEmailVaild &&
                    this.state.isPwVaild &&
                    this.state.isPwConfirmationVaild
                    );

        if(isAllFormValid) {
            axios.post('/api/signup/', user_info)
                        .then(res => console.log(res))
        }
        else {

        }
    }

    componentDidMount() {}

    render() {
        return (
            <div className="SignupForm">
                <form >
                    <input
                        id="email-input"
                        placeholder="email"
                        onChange={(e) => this.setState({ email: e.target.value })}
                        onBlur={ this.checkEmail }
                        value={ this.state.email }
                    />
                    <br/>
                    <p 
                        id="id-validation"
                    >{this.state.emailVaildText}</p>
                    <input
                        id="pw-input"
                        type="password"
                        placeholder="password"
                        onChange={(e) => this.setState({ password: e.target.value })}
                        onBlur={ this.checkPassword }
                        value = { this.state.password }
                    />
                    <p>{this.state.pwVaildText}</p>
                    <br/>
                    <input
                        id="pw-confirm-input"
                        type="password"
                        placeholder="password_confirmation"
                        onChange={(e) => this.setState({ password_confirmation: e.target.value })}
                        onBlur={ this.checkPasswordConfirmation }
                        value = { this.state.password_confirmation }
                    />
                    <p id="pw-confirm-validation">{this.state.pwConfirmationVaildText}</p>
                    <br/>
                    <input
                        id="nickname-input"
                        placeholder="nickname"
                        onChange={(e) => this.setState({ nickname: e.target.value })}
                        value = { this.state.nickname }
                    />
                    <br/>
                    <button
                        id="signup-button"
                        onClick={this.handleSubmit}
                        disabled={
                                    this.state.email === '' ||
                                    this.state.password === '' ||
                                    this.state.password_confirmation === '' ||
                                    this.state.nickname === ''
                                }
                    >
                        Signup
                    </button>
                    
                    
                </form>
            </div>);
    }
}

export default SignUpForm;
