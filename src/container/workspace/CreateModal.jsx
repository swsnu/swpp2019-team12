import React, { Component } from 'react';
import axios from 'axios';
import { map, uniqBy, differenceBy } from 'lodash';

class CreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            emailMember: '',
            emailAdmin: '',
            searchedMember: [],
            addedMember: [],
            searchedAdmin: [],
            addedAdmin: []
        };
    }

    componentDidMount() {
        axios.get('/api/profile/').then(res => {
            const {
                data: { user }
            } = res;
            console.log(res.data);
            this.setState({
                addedMember: [user],
                addedMemberId: [user.id],
                addedAdmin: [user],
                addedAdminId: [user.id]
            });
        });
    }

    CreateModalLabel = () => {
        return (
            <div className="createModal-label">
                <div className="createModal-label__label">Create Workspace</div>
            </div>
        );
    };

    CreateModalTitle = props => {
        const { title, handleChangeTitle } = props;
        return (
            <div className="createModal-title">
                <div className="createModal-title__sublabel">
                    Workspace Name
                </div>
                <input
                    type="text"
                    placeholder="Workspace 이름을 입력하세요"
                    className="createModal-title__input"
                    value={title}
                    onChange={e => handleChangeTitle(e)}
                />
            </div>
        );
    };

    CreateModalMember = props => {
        const {
            email,
            searchedMember,
            addedMember,
            handleChangeEmail,
            handleSelectMember,
            handleDeleteMember
        } = props;
        return (
            <div className="createModal-member">
                <div className="createModal-member__sublabel">Members</div>
                <div className="createModal-member__input-container">
                    <input
                        type="email"
                        placeholder="user_email @ email.com"
                        className="createModal-member__input"
                        value={email}
                        onChange={e => handleChangeEmail(e)}
                    />
                    {searchedMember.length > 0 && (
                        <div className="createModal-member__member--searched">
                            {map(searchedMember, (member, i) => (
                                <div
                                    key={i}
                                    className="createModal-member__member--searched-email"
                                    onClick={() =>
                                        handleSelectMember(
                                            member.user
                                            // member.user && member.user
                                        )
                                    }>
                                    {member.user && member.user.username}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="createModal-member__member--added">
                    {map(addedMember, (member, i) => (
                        <div
                            key={i}
                            className="createModal-member__member--added-element"
                            onClick={() => handleDeleteMember(member)}>
                            {member.username}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    CreateModalAdmin = props => {
        const {
            email,
            searchedAdmin,
            addedAdmin,
            handleChangeEmail,
            handleSelectAdmin,
            handleDeleteAdmin
        } = props;
        return (
            <div className="createModal-member">
                <div className="createModal-member__sublabel">Admins</div>
                <div className="createModal-member__input-container">
                    <input
                        type="email"
                        placeholder="user_email @ email.com"
                        className="createModal-member__input"
                        value={email}
                        onChange={e => handleChangeEmail(e)}
                    />
                    {searchedAdmin.length > 0 && (
                        <div className="createModal-member__member--searched">
                            {map(searchedAdmin, (admin, i) => (
                                <div
                                    key={i}
                                    className="createModal-member__member--searched-email"
                                    onClick={() =>
                                        handleSelectAdmin(admin.user)
                                    }>
                                    {admin.user && admin.user.username}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="createModal-member__member--added">
                    {map(addedAdmin, (admin, i) => (
                        <div
                            key={i}
                            className="createModal-member__member--added-element"
                            onClick={() => handleDeleteAdmin(admin)}>
                            {admin.username}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    handleChangeTitle = e => {
        this.setState({ title: e.target.value });
    };
    handleChangeEmailMember = e => {
        this.setState({ emailMember: e.target.value }, this.handleSearchMember);
    };
    handleChangeEmailAdmin = e => {
        this.setState({ emailAdmin: e.target.value }, this.handleSearchAdmin);
    };

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

    handleSearchAdmin = () => {
        const { emailAdmin } = this.state;
        if (emailAdmin) {
            axios.post('/api/profile/', { username: emailAdmin }).then(res => {
                const { data } = res;
                this.setState({ searchedAdmin: data });
            });
        } else {
            this.setState({ searchedAdmin: [] });
        }
    };
    handleSelectAdmin = member => {
        const addedAdmin = uniqBy([...this.state.addedAdmin, member], 'id');
        const addedAdminId = map(addedAdmin, a => a.id);
        this.setState({
            addedAdmin,
            addedAdminId,
            emailAdmin: '',
            searchedAdmin: []
        });
    };
    handleDeleteAdmin = member => {
        const removedAdmin = differenceBy(
            this.state.addedAdmin,
            [member],
            'id'
        );
        this.setState({ addedAdmin: removedAdmin });
    };

    handleCreateValidation = () => {
        const { title, addedMember } = this.state;
        return !!(title && addedMember.length);
    };

    handleCreateWorkspace = () => {
        const { title, addedMemberId, addedAdminId } = this.state;
        const { history } = this.props;
        axios
            .post('/api/workspace/', {
                name: title,
                members: addedMemberId,
                admins: addedAdminId
            })
            .then(res => {
                const {
                    status,
                    data: { id, name }
                } = res;

                history.push(`/${name}/${id}`);
                window.location.reload();
            });
    };

    render() {
        const {
            title,
            emailMember,
            emailAdmin,
            searchedMember,
            addedMember,
            addedMemberId,
            searchedAdmin,
            addedAdminId,
            addedAdmin
        } = this.state;
        const { handleCloseCreateNoteModal } = this.props;
        return (
            <div
                className="createModal overlayChild"
                onClick={e => e.stopPropagation()}>
                {this.CreateModalLabel()}
                {this.CreateModalTitle({
                    title: title,
                    handleChangeTitle: this.handleChangeTitle
                })}
                <div className="createModal-member-admin-container">
                    {this.CreateModalMember({
                        email: emailMember,
                        searchedMember: searchedMember,
                        addedMember: addedMember,
                        addedMemberId: addedMemberId,
                        handleChangeEmail: this.handleChangeEmailMember,
                        handleSelectMember: this.handleSelectMember,
                        handleDeleteMember: this.handleDeleteMember
                    })}
                    {this.CreateModalAdmin({
                        email: emailAdmin,
                        searchedAdmin: searchedAdmin,
                        addedAdmin: addedAdmin,
                        addedAdminId: addedAdminId,
                        handleChangeEmail: this.handleChangeEmailAdmin,
                        handleSelectAdmin: this.handleSelectAdmin,
                        handleDeleteAdmin: this.handleDeleteAdmin
                    })}
                </div>
                <div className="createModal-button-container">
                    <button
                        onClick={handleCloseCreateNoteModal}
                        className="modal-cancel">
                        CANCEL
                    </button>
                    {this.handleCreateValidation() ? (
                        <button
                            className="primary"
                            onClick={this.handleCreateWorkspace}>
                            CONFIRM
                        </button>
                    ) : (
                        <button className="disabled">CONFIRM</button>
                    )}
                </div>
            </div>
        );
    }
}

export default CreateModal;
