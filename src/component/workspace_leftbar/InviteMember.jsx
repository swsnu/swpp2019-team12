import React, { Component } from 'react';
import { map, uniqBy, differenceBy } from 'lodash';
import axios from 'axios';

const InviteModalMember = props => {
    const {
        email,
        searchedMember,
        addedMember,
        handleChangeEmail,
        handleSelectMember,
        handleDeleteMember
    } = props;
    return (
        <div className="invite-member">
            <div className="invite-member__input-container">
                <input
                    type="email"
                    placeholder="user_email@email.com"
                    className="invite-member__input"
                    value={email}
                    onChange={e => handleChangeEmail(e)}></input>
                {searchedMember.length > 0 && (
                    <div className="invite-member__member--searched">
                        {map(searchedMember, (member, i) => (
                            <div
                                key={i}
                                className="invite-member__member--searched-email"
                                onClick={() => handleSelectMember(member)}>
                                {member.username}
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

    componentDidMount() {
        axios
            .get('/api/user/')
            .then(res => {
                const {
                    data: { user }
                } = res;
                this.setState({ addedAdmin: [user] });
            })
            .catch(err => console.error(err));
    }

    handleSearchMember = () => {
        const { emailMember } = this.state;
        if (emailMember) {
            axios.get(`/api/user/${emailMember}`).then(res => {
                const { data } = res;
                this.setState({ searchedMember: data });
            });
        } else {
            this.setState({ searchedMember: [] });
        }
    };

    handleSelectMember = member => {
        const addedMember = uniqBy([...this.state.addedMember, member], 'id');
        this.setState({ addedMember, emailMember: '', searchedMember: [] });
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

    /******************* TODO ***********************/
    handleInviteMembers = () => {
        const { addedMember } = this.state;
        const { history } = this.props;

        axios.get('/api/workspace').then(res => {});
    };
    /*************************************************/

    render() {
        const { emailMember, searchedMember, addedMember } = this.state;
        const { handleCancel } = this.props;

        return (
            <div className="memberInfo__inviteMemberButton">
                <InviteModalMember
                    email={emailMember}
                    searchedMember={searchedMember}
                    addedMember={addedMember}
                    handleChangeEmail={this.handleChangeEmailMember}
                    handleSelectMember={this.handleSelectMember}
                    handleDeleteMember={this.handleDeleteMember}
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
