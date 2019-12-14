import React from 'react';
import axios from 'axios';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout_icon.svg';

const Signout = props => {
    const handleClick = e => {
        axios
            .get('/api/signout/')
            .then(res => {
                sessionStorage.removeItem('LoggedInUserNickname');
                sessionStorage.removeItem('LoggedInUserId');
                props.history.push('/signin');
            })
            .catch(err => {});
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
