import React, { Component } from 'react';
import axios from 'axios';
import { map, uniqBy, differenceBy } from 'lodash';

const CreateModalLabel = () => {
    return (
        <div className="createModal-label">
            <div className="createModal-label__label">Create Workspace</div>
        </div>
    );
};

const CreateModalTitle = props => {
    const { title, handleChangeTitle } = props;
    return (
        <div className="createModal-title">
            <div className="createModal-title__sublabel">Workspace Name</div>
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

const CreateModalMember = props => {
    const {
        email,
        searchedMember,
        addedMember,
        handleChangeEmail,
        handleSelectMember,
        handleDeleteMember
    } = props;
    console.log(searchedMember);
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
                                onClick={() => handleSelectMember(member)}>
                                {member.username}
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
class CreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            email: '',
            searchedMember: [],
            addedMember: []
        };
    }

    handleChangeTitle = e => {
        this.setState({ title: e.target.value });
    };
    handleChangeEmail = e => {
        this.setState({ email: e.target.value }, this.handleSearchMember);
    };

    handleSearchMember = () => {
        const { email } = this.state;
        if (email) {
            axios.get(`/api/user/${email}`).then(res => {
                const { data } = res;
                this.setState({ searchedMember: data });
            });
        } else {
            this.setState({ searchedMember: [] });
        }
    };

    handleSelectMember = member => {
        const addedMember = uniqBy([...this.state.addedMember, member], 'id');
        this.setState({ addedMember, email: '', searchedMember: [] });
    };
    handleDeleteMember = member => {
        const removedMember = differenceBy(
            this.state.addedMember,
            [member],
            'id'
        );
        this.setState({ addedMember: removedMember });
    };

    handleCreateValidation = () => {
        const { title, addedMember } = this.state;
        return !!(title && addedMember.length);
    };

    handleCreateWorkspace = () => {
        const { title, addedMember } = this.state;
        axios
            .post('/api/workspace/', { title, addedMember })
            .then(res => console.log(res));
    };

    render() {
        const { title, email, searchedMember, addedMember } = this.state;
        const { handleCancel } = this.props;
        return (
            <div
                className="createModal overlayChild"
                onClick={e => e.stopPropagation()}>
                <CreateModalLabel />
                <CreateModalTitle
                    title={title}
                    handleChangeTitle={this.handleChangeTitle}
                />
                <CreateModalMember
                    email={email}
                    searchedMember={searchedMember}
                    addedMember={addedMember}
                    handleChangeEmail={this.handleChangeEmail}
                    handleSelectMember={this.handleSelectMember}
                    handleDeleteMember={this.handleDeleteMember}
                />
                <div className="createModal-button-container">
                    <button onClick={handleCancel}>CANCEL</button>
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
