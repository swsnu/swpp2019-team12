import React from 'react';
import axios from 'axios';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout_icon.svg';

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
            <div className="signout-container" onClick={handleClick}>
                <LogoutIcon className="logout-icon" />
                <div id="logout-button" className="logout-button">
                    LOGOUT
                </div>
            </div>
        </div>
    );
};

export default Signout;
