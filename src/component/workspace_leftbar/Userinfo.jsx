import React from 'react';
import Signout from '../signout/Signout';
import logo from '../../assets/icons/logo.png';

const UserInfo = props => {
    const nickname = sessionStorage.getItem('LoggedInUserNickname');
    return (
        <div className="leftbar-component userinfo-container">
            <div className="userinfo-subContainer">
                <div className="userinfo-nickname">{nickname}</div>
                <Signout history={props.history} />
            </div>
            <div className="leftbar-logo-container">
                <img src={logo} className="leftbar-logo" />
            </div>
        </div>
    );
};

export default UserInfo;
