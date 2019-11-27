import React from 'react';
import axios from 'axios';

const SignOut = props => {
    const handleClick = e => {
        e.preventDefault();
        axios
            .get('/api/signout/')
            .finally(res => props.history.push('/signin'));
    };

    return (
        <div className="SignOut">
            <button id="logout-button" onClick={handleClick}>
                Signout
            </button>
        </div>
    );
};

export default SignOut;
