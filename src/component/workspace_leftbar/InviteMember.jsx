import React, { Component } from 'react';
import { map, uniqBy, differenceBy } from 'lodash';
import axios from 'axios';
import * as _ from 'lodash';

const InviteModalMember = props => {
    const {
        email,
        searchedMember,
        addedMember,
        members,
        handleChangeEmail,
        handleSelectMember,
        handleDeleteMember
    } = props;

    const newlySearchedMember = [];

    searchedMember.length &&
        searchedMember.map(member => {
            let flag = true;
            members.length &&
                members.map(alreadyMember => {
                    if (member['profile'].id == alreadyMember.id) {
                        flag = false;
                    }
                });
            if (flag) newlySearchedMember.push(member);
        });

    return (
        <div className="invite-member">
            <div className="invite-member__input-container">
                <input
                    type="email"
                    placeholder="user_email@email.com"
                    className="invite-member__input"
                    value={email}
                    onChange={e => handleChangeEmail(e)}></input>
                {newlySearchedMember.length > 0 && (
                    <div className="invite-member__member--searched">
                        {map(newlySearchedMember, (member, i) => (
                            <div
                                key={i}
                                className="invite-member__member--searched-email"
                                onClick={() =>
                                    handleSelectMember(
                                        // member.user && member.user
                                        member.user
                                    )
                                }>
                                {member.user && member.user.username}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="invite-member__member--added">
                {map(addedMember, (member, i) => (
                    <div
                        key={i}
                        className="invite-member__member--added-element"
                        onClick={() => handleDeleteMember(member)}>
                        {member.username}
                    </div>
                ))}
            </div>
        </div>
    );
};

class InviteMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailMember: '',
            searchedMember: [],
            addedMember: []
        };
    }

    handleSearchMember = () => {
        const { emailMember } = this.state;
        if (emailMember) {
            axios.post('/api/profile/', { username: emailMember }).then(res => {
                const { data } = res;
                this.setState({ searchedMember: data });
            });
        } else {
            this.setState({ searchedMember: [] });
        }
    };

    handleSelectMember = member => {
        const addedMember = uniqBy([...this.state.addedMember, member], 'id');
        const addedMemberId = map(addedMember, m => m.id);
        this.setState({
            addedMember,
            addedMemberId,
            emailMember: '',
            searchedMember: []
        });
    };

    handleDeleteMember = member => {
        const removedMember = differenceBy(
            this.state.addedMember,
            [member],
            'id'
        );
        this.setState({ addedMember: removedMember });
    };

    handleChangeEmailMember = e => {
        this.setState({ emailMember: e.target.value }, this.handleSearchMember);
    };

    handleInviteMembers = () => {
        const { addedMemberId } = this.state;
        axios
            .patch(`/api/workspace/${this.props.workspace.id}/`, {
                members: addedMemberId
            })
            .then(res => {
                window.location.reload();
            });
    };

    render() {
        const { emailMember, searchedMember, addedMember } = this.state;
        // const { handleCancel } = this.props;
        const { members } = this.props;

        return (
            <div className="memberInfo__inviteMemberButton">
                <InviteModalMember
                    email={emailMember}
                    searchedMember={searchedMember}
                    addedMember={addedMember}
                    handleChangeEmail={this.handleChangeEmailMember}
                    handleSelectMember={this.handleSelectMember}
                    handleDeleteMember={this.handleDeleteMember}
                    members={members}
                />

                <button
                    className="invite-confirm-button"
                    onClick={this.handleInviteMembers}>
                    Invite Member
                </button>
            </div>
        );
    }
}

export default InviteMember;
