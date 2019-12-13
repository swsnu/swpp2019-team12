import React from 'react';
import Signout from '../signout/Signout';

const UserInfo = props => {
    const nickname = sessionStorage.getItem('LoggedInUserNickname');
    return (
        <div className="leftbar-component userinfo-container">
            <div className="userinfo-nickname">{nickname}</div>
            <Signout history={props.history} />
        </div>
    );
};

export default UserInfo;
