import React from 'react';
import axios from 'axios';

const SignOut = props => {
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
        <div>
            <button id="logout-button" onClick={handleClick}>
                Signout
            </button>
        </div>
    );
};

export default SignOut;
