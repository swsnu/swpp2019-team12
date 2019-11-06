import React from 'react';
import { map } from 'lodash';

import { Label, SubLabel } from './Label';
import InviteMember from './InviteMember';
import { ReactComponent as UserIcon } from '../../assets/icons/member_default_icon.svg';

const MemberInfo = props => {
    const { members } = props;
    return (
        <div className="leftbar-component memberInfo-container">
            <Label title="Member" />
            <SubLabel title={`Total ${members.length} members`} />

            <div className="memberInfo__memberList">
                {map(members, (m, i) => (
                    <div key={i} className="memberInfo__memberList--element">
                        <UserIcon className="memberInfo__memberList--element-icon" />
                        <div className="memberInfo__memberList--element-name">
                            {m.nickname}
                        </div>
                    </div>
                ))}
            </div>

            <SubLabel title="Invite Member" />
            <InviteMember />
        </div>
    );
};

export default MemberInfo;
