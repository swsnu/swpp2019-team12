import React, { Component } from 'react';
import axios from 'axios';

export default class Signout extends Component {
    handleClick() {
        axios
            .get('/api/signout/')
            .then(res => {
                sessionStorage.removeItem('LoggedInUserNickname');
                sessionStorage.removeItem('LoggedInUserId');
            })
            .catch(err => console.log('로그인 안된 상태'))
            .finally(res => this.props.history.push('/signin'));
    }

    render() {
        return (
            <div>
                <button onClick={() => this.handleClick()}>로그아웃</button>
            </div>
        );
    }
}