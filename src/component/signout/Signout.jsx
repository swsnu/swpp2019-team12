import React, { Component } from 'react';
import axios from 'axios';

const Signout = props => {
    const handleClick = e => {
        e.preventDefault();
        axios
            .get('/api/signout/')
            .then(res => {
                sessionStorage.removeItem('LoggedInUserNickname');
                sessionStorage.removeItem('LoggedInUserId');
                props.history.push('/signin');
            })
            .catch(err => console.log('로그인 안된 상태'));
    };

    return (
        <div className="Signout">
            <button id="logout-button" onClick={handleClick}>
                로그아웃
            </button>
        </div>
    );
};

export default Signout;
