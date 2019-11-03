import React from 'react';

import { Label } from './Label';
import { ReactComponent as SettingIcon } from '../../assets/icons/settings_icon.svg';

const SettingInfo = props => {
    return (
        <div className="leftbar-component settingInfo-container">
            <Label title="Settings" />
            <div className="settingInfo__workspaceSetting">
                <SettingIcon className="settingInfo__workspaceSetting--icon" />
                <div className="settingInfo__workspaceSetting--text">
                    Workspace Setting
                </div>
            </div>
        </div>
    );
};

export default SettingInfo;
